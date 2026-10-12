/**
 * Fluent System Icons, primarily 16px Regular with explicit component-sized cuts.
 *
 * Microsoft's set, taken verbatim from `@fluentui/svg-icons` -- the path data below is
 * generated from that package, never drawn by hand. Fluent's 16px grid is the same inline
 * size Area's density axis uses, so an icon here needs no rescaling to sit on a control.
 *
 * Two things follow from using the real set rather than approximating it. Fluent icons are
 * *filled* paths, not strokes, so they take `fill` and never `stroke` or `stroke-width`;
 * and they are optically corrected per size, so a component-owned 20px slot uses the
 * 20px cut rather than scaling a 16px path.
 *
 * The component demos' icons are Area's own drawings (AREA_SWAP in gen-icons.mjs, the demo swap):
 * those names render pilot-icons.tsx, and their Fluent cuts stay here as FluentCut<Name>.
 *
 * Regenerate with `node scripts/gen-icons.mjs` after changing the map there.
 */
import { PilotAddIcon, PilotAlignBottomIcon, PilotAlignCenterIcon, PilotAlignLeftIcon, PilotAlignMiddleIcon, PilotAlignRightIcon, PilotAlignTopIcon, PilotAngleIcon, PilotArrowRightIcon, PilotArrowUpIcon, PilotArrowUpRightIcon, PilotAspectRatioIcon, PilotAutoLayoutIcon, PilotBellIcon, PilotBoldIcon, PilotCalendarIcon, PilotChatIcon, PilotCheckIcon, PilotChevronDownIcon, PilotChevronLeftIcon, PilotChevronRightIcon, PilotCodeIcon, PilotCopyIcon, PilotCornerIcon, PilotCornersIcon, PilotDismissIcon, PilotDocumentIcon, PilotDotsFourIcon, PilotEyeIcon, PilotEyeOffIcon, PilotFlipIcon, PilotFlipVerticalIcon, PilotFlowFreeIcon, PilotFlowIcon, PilotFlowVerticalIcon, PilotFlowWrapIcon, PilotFolderIcon, PilotFrameIcon, PilotHeartIcon, PilotInfoIcon, PilotItalicIcon, PilotLinkIcon, PilotMenuIcon, PilotMoreHorizontalIcon, PilotOpacityIcon, PilotOpenIcon, PilotPaintbrushIcon, PilotPanelLeftIcon, PilotPauseFilledIcon, PilotPenToolIcon, PilotPencilIcon, PilotPersonIcon, PilotPlayIcon, PilotPointerIcon, PilotRectangleIcon, PilotRefreshIcon, PilotRotateIcon, PilotSearchIcon, PilotSettingsIcon, PilotSkipBackFilledIcon, PilotSkipForwardFilledIcon, PilotSlidersIcon, PilotStrikethroughIcon, PilotSubtractIcon, PilotSunIcon, PilotTextAlignCenterIcon, PilotTextAlignLeftIcon, PilotTextAlignRightIcon, PilotTextIcon, PilotThumbsDownIcon, PilotThumbsUpIcon, PilotTokenIcon, PilotTrashIcon, PilotTrendingUpIcon, PilotUnderlineIcon, PilotVolumeIcon, PilotWarningIcon, type PilotIconProps } from "./pilot-icons.tsx";

const base = {
  viewBox: "0 0 16 16",
  // Fluent's own intrinsic size. A slot that owns an icon token overrides it in CSS;
  // this is only the fallback for an icon rendered outside one.
  width: 16,
  height: 16,
  fill: "currentColor",
  focusable: false as const,
  "aria-hidden": true,
};

const base20 = { ...base, viewBox: "0 0 20 20", width: 20, height: 20 };

/** Area `add` (the demo swap). */
export const PlusIcon = (props: PilotIconProps) => <PilotAddIcon {...props} />;

/** Fluent `add_16_regular`. */
export const FluentCutPlusIcon = () => (
  <svg {...base}>
    <path d="M8 2c.28 0 .5.22.5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Area `bell` (the demo swap). */
export const BellIcon = (props: PilotIconProps) => <PilotBellIcon {...props} />;

/** Fluent `alert_16_regular`. */
export const FluentCutBellIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h3a2 2 0 1 0 4 0h3a.5.5 0 0 0 .46-.69l-.96-2.4V6.5A4.5 4.5 0 0 0 8 2m1 10a1 1 0 0 1-1 1 1 1 0 0 1-1-1zM4.5 6.5a3.5 3.5 0 1 1 7 0V9q0 .09.04.18l.72 1.82H3.74l.72-1.82L4.5 9z" />
  </svg>
);

/** Area `search` (the demo swap). */
export const SearchIcon = (props: PilotIconProps) => <PilotSearchIcon {...props} />;

/** Fluent `search_16_regular`. */
export const FluentCutSearchIcon = () => (
  <svg {...base}>
    <path d="M11.02 11.73a5.5 5.5 0 1 1 .7-.7l3.13 3.12a.5.5 0 0 1-.7.7zM12 7.5a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0" />
  </svg>
);

/** Area `check` (the demo swap). */
export const CheckIcon = (props: PilotIconProps) => <PilotCheckIcon {...props} />;

/** Fluent `checkmark_16_regular`. */
export const FluentCutCheckIcon = () => (
  <svg {...base}>
    <path d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02" />
  </svg>
);

/** Area `info` (the demo swap). */
export const InfoIcon = (props: PilotIconProps) => <PilotInfoIcon {...props} />;

/** Fluent `info_16_regular`. */
export const FluentCutInfoIcon = () => (
  <svg {...base}>
    <path d="M8.5 7.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm.25-2a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8" />
  </svg>
);

/** Area `warning` (the demo swap). */
export const AlertIcon = (props: PilotIconProps) => <PilotWarningIcon {...props} />;

/** Fluent `warning_16_regular`. */
export const FluentCutAlertIcon = () => (
  <svg {...base}>
    <path d="M5.82 2.28a2.5 2.5 0 0 1 4.36 0l4.5 8A2.5 2.5 0 0 1 12.5 14h-9a2.5 2.5 0 0 1-2.18-3.72zm3.49.48a1.5 1.5 0 0 0-2.62 0l-4.5 8a1.5 1.5 0 0 0 1.31 2.24h9a1.5 1.5 0 0 0 1.3-2.23zM8 9.5A.75.75 0 1 1 8 11a.75.75 0 0 1 0-1.5M8 5c.28 0 .5.22.5.5V8a.5.5 0 0 1-1 0V5.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Area `arrow-right` (the demo swap). */
export const ArrowIcon = (props: PilotIconProps) => <PilotArrowRightIcon {...props} />;

/** Fluent `arrow_right_16_regular`. */
export const FluentCutArrowIcon = () => (
  <svg {...base}>
    <path d="M2.5 7.5a.5.5 0 1 0 0 1h9.7l-4.03 3.63a.5.5 0 1 0 .66.74l5-4.5a.5.5 0 0 0 0-.74l-5-4.5a.5.5 0 0 0-.66.74L12.2 7.5z" />
  </svg>
);

/** Area `arrow-up` (the demo swap). */
export const ArrowUpIcon = (props: PilotIconProps) => <PilotArrowUpIcon {...props} />;

/** Fluent `arrow_up_16_regular`. */
export const FluentCutArrowUpIcon = () => (
  <svg {...base}>
    <path d="M7.5 13.5a.5.5 0 0 0 1 0V3.8l3.63 4.03a.5.5 0 0 0 .74-.66l-4.5-5a.5.5 0 0 0-.74 0l-4.5 5a.5.5 0 0 0 .74.66L7.5 3.8z" />
  </svg>
);

/** Area `chevron-down` (the demo swap). */
export const ChevronIcon = (props: PilotIconProps) => <PilotChevronDownIcon {...props} />;

/** Fluent `chevron_down_16_regular`. */
export const FluentCutChevronIcon = () => (
  <svg {...base}>
    <path d="M3.15 5.65c.2-.2.5-.2.7 0L8 9.79l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Area `folder` (the demo swap). */
export const FolderIcon = (props: PilotIconProps) => <PilotFolderIcon {...props} />;

/** Fluent `folder_16_regular`. */
export const FluentCutFolderIcon = () => (
  <svg {...base}>
    <path d="M2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3H3.5C2.67 3 2 3.67 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5zM2 7v4.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7z" />
  </svg>
);

/** Area `document` (the demo swap). */
export const DocumentIcon = (props: PilotIconProps) => <PilotDocumentIcon {...props} />;

/** Fluent `document_16_regular`. */
export const FluentCutDocumentIcon = () => (
  <svg {...base}>
    <path d="M5 1a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06L9.65 1.44A1.5 1.5 0 0 0 8.59 1zM4 3a1 1 0 0 1 1-1h3v2.5C8 5.33 8.67 6 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.8 2H9.5a.5.5 0 0 1-.5-.5V2.2z" />
  </svg>
);

/** Area `dismiss` (the demo swap). */
export const DismissIcon = (props: PilotIconProps) => <PilotDismissIcon {...props} />;

/** Fluent `dismiss_16_regular`. */
export const FluentCutDismissIcon = () => (
  <svg {...base}>
    <path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

/** Area `trash` (the demo swap). */
export const TrashIcon = (props: PilotIconProps) => <PilotTrashIcon {...props} />;

/** Fluent `delete_16_regular`. */
export const FluentCutTrashIcon = () => (
  <svg {...base}>
    <path d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.56l-1.2 8.84A2.5 2.5 0 0 1 9.74 15h-3.5a2.5 2.5 0 0 1-2.48-2.16L2.57 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5m-4.74 6.7c.1.75.74 1.3 1.49 1.3h3.5a1.5 1.5 0 0 0 1.5-1.3L12.42 4H3.57z" />
  </svg>
);

/** Area `link` (the demo swap). */
export const LinkIcon = (props: PilotIconProps) => <PilotLinkIcon {...props} />;

/** Fluent `link_16_regular`. */
export const FluentCutLinkIcon = () => (
  <svg {...base}>
    <path d="M9.5 4h1a3.5 3.5 0 0 1 .2 7H9.5a.5.5 0 0 1-.1-.99h.1l1-.01a2.5 2.5 0 0 0 .16-5H9.5a.5.5 0 0 1-.09-1zh1zm-4 0h1a.5.5 0 0 1 .09 1H5.5a2.5 2.5 0 0 0-.16 5H6.5a.5.5 0 0 1 .09 1H5.5a3.5 3.5 0 0 1-.2-7zh1zm0 3h5a.5.5 0 0 1 .09 1H5.5a.5.5 0 0 1-.09-1z" />
  </svg>
);

/** Area `open` (the demo swap). */
export const OpenIcon = (props: PilotIconProps) => <PilotOpenIcon {...props} />;

/** Fluent `open_16_regular`. */
export const FluentCutOpenIcon = () => (
  <svg {...base}>
    <path d="M4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V9.27a.5.5 0 0 1 1 0v2.23a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2h2.23a.5.5 0 0 1 0 1zm4.27-.5c0-.28.22-.5.5-.5h4.23c.28 0 .5.22.5.5v4.23a.5.5 0 0 1-1 0V3.71L9.62 7.08a.5.5 0 1 1-.7-.7L12.29 3H9.27a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Area `person` (the demo swap). */
export const PersonSmallIcon = (props: PilotIconProps) => <PilotPersonIcon {...props} />;

/** Fluent `person_16_regular`. */
export const FluentCutPersonSmallIcon = () => (
  <svg {...base}>
    <path d="M11.5 8c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C3 8.67 3.67 8 4.5 8zm0 1h-7a.5.5 0 0 0-.5.5v.5c0 1.44 1.43 3 4 3s4-1.56 4-3v-.5a.5.5 0 0 0-.5-.5M8 1.5A2.75 2.75 0 1 1 8 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 8 6a1.75 1.75 0 0 0 0-3.5" />
  </svg>
);

/** Area `person,20` (the demo swap). */
export const PersonIcon = (props: PilotIconProps) => <PilotPersonIcon size={20} {...props} />;

/** Fluent `person_20_regular`. */
export const FluentCutPersonIcon = () => (
  <svg {...base20}>
    <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0m-2 5a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.8A9 9 0 0 0 10 18c1.85 0 3.58-.39 4.87-1.2A4.4 4.4 0 0 0 17 13a2 2 0 0 0-2-2zm-1 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1c0 1.3-.62 2.28-1.67 2.95A8 8 0 0 1 10 17a8 8 0 0 1-4.33-1.05A3.4 3.4 0 0 1 4 13" />
  </svg>
);

/** Area `align-top` (the demo swap). */
export const AlignTopIcon = (props: PilotIconProps) => <PilotAlignTopIcon {...props} />;

/** Fluent `align_top_16_regular`. */
export const FluentCutAlignTopIcon = () => (
  <svg {...base}>
    <path d="M1.5 2a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1zM2 5.75C2 4.78 2.78 4 3.75 4h1.5C6.22 4 7 4.78 7 5.75v6.5C7 13.22 6.22 14 5.25 14h-1.5C2.78 14 2 13.22 2 12.25zM3.75 5a.75.75 0 0 0-.75.75v6.5c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-6.5A.75.75 0 0 0 5.25 5zM9 5.75C9 4.78 9.78 4 10.75 4h1.5c.97 0 1.75.78 1.75 1.75v4.5c0 .97-.78 1.75-1.75 1.75h-1.5C9.78 12 9 11.22 9 10.25zM10.75 5a.75.75 0 0 0-.75.75v4.5c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-4.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Area `align-middle` (the demo swap). */
export const AlignMiddleIcon = (props: PilotIconProps) => <PilotAlignMiddleIcon {...props} />;

/** Fluent `align_center_vertical_16_regular`. */
export const FluentCutAlignMiddleIcon = () => (
  <svg {...base}>
    <path d="M8.5 15a.5.5 0 0 1-.5-.5V14H6.75C5.78 14 5 13.22 5 12.25v-1.5C5 9.78 5.78 9 6.75 9H8V7H5.75C4.78 7 4 6.22 4 5.25v-1.5C4 2.78 4.78 2 5.75 2H8v-.5a.5.5 0 0 1 1 0V2h2.25c.97 0 1.75.78 1.75 1.75v1.5C13 6.22 12.22 7 11.25 7H9v2h1.25c.97 0 1.75.78 1.75 1.75v1.5c0 .97-.78 1.75-1.75 1.75H9v.5a.5.5 0 0 1-.5.5M5.75 3a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h5.5c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75zm1 7a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h3.5c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Area `align-bottom` (the demo swap). */
export const AlignBottomIcon = (props: PilotIconProps) => <PilotAlignBottomIcon {...props} />;

/** Fluent `align_bottom_16_regular`. */
export const FluentCutAlignBottomIcon = () => (
  <svg {...base}>
    <path d="M1.5 14a.5.5 0 0 1 0-1h13a.5.5 0 0 1 0 1zm.5-3.75c0 .97.78 1.75 1.75 1.75h1.5C6.22 12 7 11.22 7 10.25v-6.5C7 2.78 6.22 2 5.25 2h-1.5C2.78 2 2 2.78 2 3.75zm1.75.75a.75.75 0 0 1-.75-.75v-6.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75zM9 10.25c0 .97.78 1.75 1.75 1.75h1.5c.97 0 1.75-.78 1.75-1.75v-4.5C14 4.78 13.22 4 12.25 4h-1.5C9.78 4 9 4.78 9 5.75zm1.75.75a.75.75 0 0 1-.75-.75v-4.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v4.5c0 .41-.34.75-.75.75z" />
  </svg>
);

/** Area `more-horizontal` (the demo swap). */
export const MoreIcon = (props: PilotIconProps) => <PilotMoreHorizontalIcon {...props} />;

/** Fluent `more_horizontal_16_regular`. */
export const FluentCutMoreIcon = () => (
  <svg {...base}>
    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Area `settings` (the demo swap). */
export const SettingsIcon = (props: PilotIconProps) => <PilotSettingsIcon {...props} />;

/** Fluent `settings_16_regular`. */
export const FluentCutSettingsIcon = () => (
  <svg {...base}>
    <path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4M7 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0m3.62-3.6a.7.7 0 0 1-.83-.57l-.26-1.42a.4.4 0 0 0-.27-.28 6 6 0 0 0-2.52 0 .4.4 0 0 0-.27.29L6.2 3.83l-.03.11a.7.7 0 0 1-.9.43L3.9 3.88a.4.4 0 0 0-.38.1q-.86.96-1.26 2.17-.06.23.1.38l1.1.93a.7.7 0 0 1 0 1.08l-1.1.93q-.16.16-.1.38.4 1.21 1.26 2.17.17.16.38.1l1.36-.49.11-.03a.7.7 0 0 1 .83.57l.26 1.41q.05.23.27.29a6 6 0 0 0 2.52 0 .4.4 0 0 0 .27-.29l.26-1.41.03-.11a.7.7 0 0 1 .9-.43l1.37.49q.21.06.38-.1.86-.96 1.26-2.17a.4.4 0 0 0-.1-.38l-1.1-.93-.09-.08a.7.7 0 0 1 .08-1l1.1-.93q.18-.16.11-.38-.4-1.21-1.26-2.17a.4.4 0 0 0-.38-.1l-1.36.49zM4 4.98l.94.33a1.7 1.7 0 0 0 2.25-1.3l.18-.97a5 5 0 0 1 1.26 0l.18.97a1.7 1.7 0 0 0 2.25 1.3l.94-.33q.39.5.63 1.08l-.75.64a1.7 1.7 0 0 0 0 2.6l.75.64q-.24.59-.63 1.08l-.94-.33a1.7 1.7 0 0 0-2.25 1.3l-.18.97a5 5 0 0 1-1.26 0l-.18-.97a1.7 1.7 0 0 0-2.25-1.3l-.94.33q-.39-.5-.63-1.08l.75-.64a1.7 1.7 0 0 0 0-2.6l-.75-.64q.24-.58.63-1.08" />
  </svg>
);

/** Fluent `eye_16_regular`. */
export const FluentEyeIcon = () => (
  <svg {...base}>
    <path d="M2.98 8.62a.5.5 0 0 1-.6.36c-.44-.11-.36-.6-.36-.6l.01-.07.05-.14q.06-.2.2-.5c.18-.4.47-.95.92-1.49C4.1 5.08 5.6 4 8 4s3.9 1.09 4.8 2.18a7 7 0 0 1 1.18 2.17v.02a.5.5 0 0 1-.96.26L13 8.6a3 3 0 0 0-.2-.52 6 6 0 0 0-.78-1.26A5 5 0 0 0 8 5c-2.04 0-3.29.91-4.03 1.82A6 6 0 0 0 3 8.6zM8 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M6.5 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" />
  </svg>
);

/** Area `align-left` (the demo swap). */
export const AlignLeftIcon = (props: PilotIconProps) => <PilotAlignLeftIcon {...props} />;

/** Fluent `align_left_16_regular`. */
export const FluentCutAlignLeftIcon = () => (
  <svg {...base}>
    <path d="M2 1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-1 0zm3.75.5C4.78 2 4 2.78 4 3.75v1.5C4 6.22 4.78 7 5.75 7h6.5C13.22 7 14 6.22 14 5.25v-1.5C14 2.78 13.22 2 12.25 2zM5 3.75c0-.41.34-.75.75-.75h6.5c.41 0 .75.34.75.75v1.5c0 .41-.34.75-.75.75h-6.5A.75.75 0 0 1 5 5.25zM5.75 9C4.78 9 4 9.78 4 10.75v1.5c0 .97.78 1.75 1.75 1.75h4.5c.97 0 1.75-.78 1.75-1.75v-1.5C12 9.78 11.22 9 10.25 9zM5 10.75c0-.41.34-.75.75-.75h4.5c.41 0 .75.34.75.75v1.5c0 .41-.34.75-.75.75h-4.5a.75.75 0 0 1-.75-.75z" />
  </svg>
);

/** Area `align-center` (the demo swap). */
export const AlignCenterHorizontalIcon = (props: PilotIconProps) => <PilotAlignCenterIcon {...props} />;

/** Fluent `align_center_horizontal_16_regular`. */
export const FluentCutAlignCenterHorizontalIcon = () => (
  <svg {...base}>
    <path d="M15 7.5a.5.5 0 0 1-.5.5H14v1.25c0 .97-.78 1.75-1.75 1.75h-1.5C9.78 11 9 10.22 9 9.25V8H7v2.25C7 11.22 6.22 12 5.25 12h-1.5C2.78 12 2 11.22 2 10.25V8h-.5a.5.5 0 0 1 0-1H2V4.75C2 3.78 2.78 3 3.75 3h1.5C6.22 3 7 3.78 7 4.75V7h2V5.75C9 4.78 9.78 4 10.75 4h1.5c.97 0 1.75.78 1.75 1.75V7h.5c.28 0 .5.22.5.5M3 10.25c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-5.5A.75.75 0 0 0 5.25 4h-1.5a.75.75 0 0 0-.75.75zm7-1c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-3.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75z" />
  </svg>
);

/** Area `align-right` (the demo swap). */
export const AlignRightIcon = (props: PilotIconProps) => <PilotAlignRightIcon {...props} />;

/** Fluent `align_right_16_regular`. */
export const FluentCutAlignRightIcon = () => (
  <svg {...base}>
    <path d="M14 1.5a.5.5 0 0 0-1 0v13a.5.5 0 0 0 1 0zm-3.75.5c.97 0 1.75.78 1.75 1.75v1.5C12 6.22 11.22 7 10.25 7h-6.5C2.78 7 2 6.22 2 5.25v-1.5C2 2.78 2.78 2 3.75 2zM11 3.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h6.5c.41 0 .75-.34.75-.75zM10.25 9c.97 0 1.75.78 1.75 1.75v1.5c0 .97-.78 1.75-1.75 1.75h-4.5C4.78 14 4 13.22 4 12.25v-1.5C4 9.78 4.78 9 5.75 9zm.75 1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h4.5c.41 0 .75-.34.75-.75z" />
  </svg>
);

/** Area `subtract` (the demo swap). */
export const SubtractIcon = (props: PilotIconProps) => <PilotSubtractIcon {...props} />;

/** Fluent `subtract_16_regular`. */
export const FluentCutSubtractIcon = () => (
  <svg {...base}>
    <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8" />
  </svg>
);

/** Area `thumbs-up` (the demo swap). */
export const ThumbLikeIcon = (props: PilotIconProps) => <PilotThumbsUpIcon {...props} />;

/** Fluent `thumb_like_16_regular`. */
export const FluentCutThumbLikeIcon = () => (
  <svg {...base}>
    <path d="M8.03 1.92c.21-.52.8-1.08 1.55-.87.6.17.97.52 1.2 1 .2.44.25.96.26 1.46a8 8 0 0 1-.24 1.74q-.09.4-.19.74h1.38a2 2 0 0 1 1.92 2.56l-1.36 4.65a2.5 2.5 0 0 1-3.15 1.68L4.05 13.2A2 2 0 0 1 2.77 12l-.52-1.4a2 2 0 0 1 .86-2.42l1.87-1.1.02-.01.1-.09q.15-.1.4-.4c.35-.39.82-1.03 1.3-2.04.2-.44.37-.78.53-1.1.25-.5.46-.92.7-1.52m-2.51 6-.02.01-1.88 1.11a1 1 0 0 0-.43 1.22l.52 1.38a1 1 0 0 0 .64.6l5.35 1.68c.8.26 1.65-.2 1.89-1l1.36-4.65A1 1 0 0 0 12 6.99H9.93a.5.5 0 0 1-.48-.67c.1-.28.26-.77.38-1.3.13-.54.22-1.08.2-1.5q0-.68-.16-1.05a.8.8 0 0 0-.56-.45q-.06-.03-.16.03a.5.5 0 0 0-.19.25c-.25.63-.5 1.11-.76 1.65q-.24.45-.5 1.01a10 10 0 0 1-1.45 2.28 5 5 0 0 1-.7.66zm-.54-.84Z" />
  </svg>
);

/** Area `thumbs-down` (the demo swap). */
export const ThumbDislikeIcon = (props: PilotIconProps) => <PilotThumbsDownIcon {...props} />;

/** Fluent `thumb_dislike_16_regular`. */
export const FluentCutThumbDislikeIcon = () => (
  <svg {...base}>
    <path d="m10.58 10 .05.45a11 11 0 0 1-.02 2.68c-.07.44-.2.88-.44 1.23-.25.38-.64.64-1.17.64s-.83-.37-1.02-.7c-.2-.31-.36-.75-.54-1.2l-.01-.03c-.55-1.4-1.3-3.31-3.3-4.65q-.47-.3-.86-.46c-.7-.3-1.32-1.06-1.16-1.94l.23-1.2a2 2 0 0 1 1.43-1.55l4.95-1.38a3.5 3.5 0 0 1 4.37 2.73l.46 2.42A2.5 2.5 0 0 1 11.09 10zm1.53-5.2a2.5 2.5 0 0 0-3.13-1.94L4.03 4.23a1 1 0 0 0-.71.78l-.22 1.2c-.06.28.16.66.55.82q.47.2 1.03.55c2.28 1.53 3.13 3.7 3.67 5.11l.01.02q.28.74.47 1.08A1 1 0 0 0 9 14q.2.01.35-.2.19-.27.28-.83a10 10 0 0 0-.08-3.12l-.03-.2-.01-.05V9.6A.5.5 0 0 1 10 9h1.09a1.5 1.5 0 0 0 1.47-1.78z" />
  </svg>
);

/** Area `volume` (the demo swap). */
export const SpeakerIcon = (props: PilotIconProps) => <PilotVolumeIcon {...props} />;

/** Fluent `speaker_2_16_regular`. */
export const FluentCutSpeakerIcon = () => (
  <svg {...base}>
    <path d="M8.7 2.04q.29.14.3.46v11a.5.5 0 0 1-.85.36l-2.93-2.88H3.5A1.5 1.5 0 0 1 2 9.48V6.5C2 5.66 2.67 5 3.5 5h1.72l2.93-2.85a.5.5 0 0 1 .54-.1M8 3.69 5.78 5.85a.5.5 0 0 1-.35.14H3.5a.5.5 0 0 0-.5.5v3c0 .27.22.5.5.5h1.93a.5.5 0 0 1 .35.13L8 12.32zm2.11 1.5a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m1.7-2.08a.5.5 0 1 0-.62.78l.01.01.25.24A5.5 5.5 0 0 1 13 8a5.5 5.5 0 0 1-1.8 4.1h-.01a.5.5 0 0 0 .62.8l.04-.04.32-.3A6.5 6.5 0 0 0 14 8a6.5 6.5 0 0 0-2.15-4.86l-.03-.02zM10.2 5.89Z" />
  </svg>
);

/** Area `refresh` (the demo swap). */
export const RegenerateIcon = (props: PilotIconProps) => <PilotRefreshIcon {...props} />;

/** Fluent `arrow_clockwise_16_regular`. */
export const FluentCutRegenerateIcon = () => (
  <svg {...base}>
    <path d="M3 8a5 5 0 0 1 9-3h-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.53A5.99 5.99 0 0 0 2 8a6 6 0 0 0 11.98.54.5.5 0 0 0-1-.08A5 5 0 0 1 3 8" />
  </svg>
);

/** Area `pencil` (the demo swap). */
export const EditIcon = (props: PilotIconProps) => <PilotPencilIcon {...props} />;

/** Fluent `edit_16_regular`. */
export const FluentCutEditIcon = () => (
  <svg {...base}>
    <path d="M14.24 1.76a2.6 2.6 0 0 0-3.71 0L2.66 9.64q-.57.57-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86q.78-.21 1.35-.78l7.88-7.87a2.6 2.6 0 0 0 0-3.7m-3 .71a1.62 1.62 0 1 1 2.29 2.3l-.78.77-2.3-2.29zM9.75 3.96l2.3 2.29-6.4 6.39q-.37.37-.89.5l-2.57.67.66-2.57q.14-.52.51-.9z" />
  </svg>
);

/** Fluent `speaker_2_16_regular`. */
export const FluentRefVolumeIcon = () => (
  <svg {...base}>
    <path d="M8.7 2.04q.29.14.3.46v11a.5.5 0 0 1-.85.36l-2.93-2.88H3.5A1.5 1.5 0 0 1 2 9.48V6.5C2 5.66 2.67 5 3.5 5h1.72l2.93-2.85a.5.5 0 0 1 .54-.1M8 3.69 5.78 5.85a.5.5 0 0 1-.35.14H3.5a.5.5 0 0 0-.5.5v3c0 .27.22.5.5.5h1.93a.5.5 0 0 1 .35.13L8 12.32zm2.11 1.5a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m1.7-2.08a.5.5 0 1 0-.62.78l.01.01.25.24A5.5 5.5 0 0 1 13 8a5.5 5.5 0 0 1-1.8 4.1h-.01a.5.5 0 0 0 .62.8l.04-.04.32-.3A6.5 6.5 0 0 0 14 8a6.5 6.5 0 0 0-2.15-4.86l-.03-.02zM10.2 5.89Z" />
  </svg>
);

/** Fluent `speaker_2_16_filled`. */
export const FluentRefVolumeFilledIcon = () => (
  <svg {...base}>
    <path d="M9 2.5a.5.5 0 0 0-.85-.36L5.22 5H3.5C2.67 5 2 5.66 2 6.5v3c0 .82.67 1.5 1.5 1.5h1.72l2.93 2.87A.5.5 0 0 0 9 13.5zm1.11 2.69a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m1.7-2.08a.5.5 0 1 0-.62.78l.01.01.25.24A5.5 5.5 0 0 1 13 8a5.5 5.5 0 0 1-1.8 4.1h-.01a.5.5 0 0 0 .62.8l.04-.04.32-.3A6.5 6.5 0 0 0 14 8a6.5 6.5 0 0 0-2.15-4.86l-.03-.02zM10.2 5.89Z" />
  </svg>
);

/** Fluent `speaker_mute_16_regular`. */
export const FluentRefVolumeOffIcon = () => (
  <svg {...base}>
    <path d="M8.7 2.04q.29.14.3.46v11a.5.5 0 0 1-.85.36l-2.93-2.88H3.5A1.5 1.5 0 0 1 2 9.48V6.5C2 5.66 2.67 5 3.5 5h1.72l2.93-2.85a.5.5 0 0 1 .54-.1M8 3.69 5.78 5.85a.5.5 0 0 1-.35.14H3.5a.5.5 0 0 0-.5.5v3c0 .27.22.5.5.5h1.93a.5.5 0 0 1 .35.13L8 12.32zm2.15 2.46c.2-.2.5-.2.7 0L12 7.29l1.15-1.14a.5.5 0 1 1 .7.7L12.71 8l1.14 1.15a.5.5 0 1 1-.7.7L12 8.71l-1.15 1.14a.5.5 0 0 1-.7-.7L11.29 8l-1.14-1.15a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `speaker_mute_16_filled`. */
export const FluentRefVolumeOffFilledIcon = () => (
  <svg {...base}>
    <path d="M9 2.5a.5.5 0 0 0-.85-.36L5.22 5H3.5C2.67 5 2 5.66 2 6.5v3c0 .82.67 1.5 1.5 1.5h1.72l2.93 2.87A.5.5 0 0 0 9 13.5zm1.15 3.65c.2-.2.5-.2.7 0L12 7.29l1.15-1.14a.5.5 0 1 1 .7.7L12.71 8l1.14 1.15a.5.5 0 1 1-.7.7L12 8.71l-1.15 1.14a.5.5 0 0 1-.7-.7L11.29 8l-1.14-1.15a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `music_note_2_16_regular`. */
export const FluentRefMusicIcon = () => (
  <svg {...base}>
    <path d="M12 5.21v5.06A2 2 0 1 0 13 12V1.93a.8.8 0 0 0-1.07-.76l-6.4 2.29A.8.8 0 0 0 5 4.2v7.06A2 2 0 1 0 6 13V7.35zm0-1.06L6 6.29V4.35l6-2.14zM11 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
  </svg>
);

/** Fluent `music_note_2_16_filled`. */
export const FluentRefMusicFilledIcon = () => (
  <svg {...base}>
    <path d="M12 5.21v5.06A2 2 0 1 0 13 12V1.93a.8.8 0 0 0-1.07-.76l-6.4 2.29A.8.8 0 0 0 5 4.2v7.06A2 2 0 1 0 6 13V7.35z" />
  </svg>
);

/** Fluent `filmstrip_16_regular`. */
export const FluentRefFilmIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM3.5 4C2.67 4 2 4.67 2 5.5v5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5zM12 5.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zm.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5M3 5.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zM3.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `filmstrip_16_filled`. */
export const FluentRefFilmFilledIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zm11 0v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0m.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5M3 5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0M3.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `payment_16_regular`. */
export const FluentRefCreditCardIcon = () => (
  <svg {...base}>
    <path d="M10.5 10a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zM1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM14 6v-.5c0-.83-.67-1.5-1.5-1.5h-9C2.67 4 2 4.67 2 5.5V6zM2 7v3.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V7z" />
  </svg>
);

/** Fluent `payment_16_filled`. */
export const FluentRefCreditCardFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 3A2.5 2.5 0 0 0 1 5.5V6h14v-.5A2.5 2.5 0 0 0 12.5 3zM15 7H1v3.5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5zm-4.5 3h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `wallet_16_regular`. */
export const FluentRefWalletIcon = () => (
  <svg {...base}>
    <path d="M10.5 8a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm-7-6C2.67 2 2 2.67 2 3.5v8A2.5 2.5 0 0 0 4.5 14H12a2 2 0 0 0 2-2V6a2 2 0 0 0-1-1.73V4a2 2 0 0 0-2-2zm0 1H11a1 1 0 0 1 1 1H3.5a.5.5 0 0 1 0-1m0 2H12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 11.5V4.91q.23.09.5.09" />
  </svg>
);

/** Fluent `wallet_16_filled`. */
export const FluentRefWalletFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3.5C2 2.67 2.67 2 3.5 2H11a2 2 0 0 1 2 2v.27c.6.34 1 .99 1 1.73v6a2 2 0 0 1-2 2H4.5A2.5 2.5 0 0 1 2 11.5zm1 0c0 .28.22.5.5.5H12a1 1 0 0 0-1-1H3.5a.5.5 0 0 0-.5.5M10.5 8a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `receipt_16_regular`. */
export const FluentRefReceiptIcon = () => (
  <svg {...base}>
    <path d="M3.75 2C2.78 2 2 2.78 2 3.75v7.75A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5V10h-3V3.75C11 2.78 10.22 2 9.25 2zM11 11h2v.5c0 .83-.67 1.5-1.5 1.5H11zM3 3.75c0-.41.34-.75.75-.75h5.5c.41 0 .75.34.75.75V13H4.5A1.5 1.5 0 0 1 3 11.5zM4.5 5.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m.5 2a.5.5 0 0 0 0 1h1.5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `receipt_16_filled`. */
export const FluentRefReceiptFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3.75C2 2.78 2.78 2 3.75 2h5.5c.97 0 1.75.78 1.75 1.75V10h3v1.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM11 13h.5c.83 0 1.5-.67 1.5-1.5V11h-2zM4.5 5.5c0 .28.22.5.5.5h3a.5.5 0 0 0 0-1H5a.5.5 0 0 0-.5.5m.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm-.5 3c0 .28.22.5.5.5h1.5a.5.5 0 0 0 0-1H5a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `lightbulb_16_regular`. */
export const FluentRefLightbulbIcon = () => (
  <svg {...base}>
    <path d="M4.5 6.5A3.5 3.5 0 1 1 10.45 9q-.3.28-.44.73L9.66 11H6.34l-.35-1.27q-.14-.45-.44-.73A3.5 3.5 0 0 1 4.5 6.5M6.6 12h2.8l-.18.63a.5.5 0 0 1-.48.37H7.26a.5.5 0 0 1-.48-.37zM8 2a4.5 4.5 0 0 0-3.16 7.7q.15.15.19.3l.79 2.9c.17.65.77 1.1 1.44 1.1h1.48a1.5 1.5 0 0 0 1.44-1.1l.8-2.9q.03-.15.18-.3A4.49 4.49 0 0 0 8 2" />
  </svg>
);

/** Fluent `lightbulb_16_filled`. */
export const FluentRefLightbulbFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-3.16 7.7q.15.15.19.3l.27 1h5.4l.27-1q.04-.15.19-.3A4.49 4.49 0 0 0 8 2m2.43 10H5.57l.25.9c.17.65.77 1.1 1.44 1.1h1.48a1.5 1.5 0 0 0 1.44-1.1z" />
  </svg>
);

/** Fluent `megaphone_16_regular`. */
export const FluentRefMegaphoneIcon = () => (
  <svg {...base}>
    <path d="M15 3.5c0-1.02-1-1.75-1.98-1.42l-11 3.72A1.5 1.5 0 0 0 1 7.22v1.56c0 .65.4 1.22 1.02 1.42l1.98.68V12a3 3 0 0 0 5.87.87l3.15 1.07A1.5 1.5 0 0 0 15 12.5zm-1.66-.47a.5.5 0 0 1 .66.47v9.01a.5.5 0 0 1-.66.48l-11-3.73A.5.5 0 0 1 2 8.78V7.22c0-.22.14-.4.34-.48zm-4.42 9.52A2 2 0 0 1 5 12v-.78z" />
  </svg>
);

/** Fluent `megaphone_16_filled`. */
export const FluentRefMegaphoneFilledIcon = () => (
  <svg {...base}>
    <path d="M15 3.5c0-1.02-1-1.75-1.98-1.42l-11 3.72A1.5 1.5 0 0 0 1 7.22v1.56c0 .65.4 1.22 1.02 1.42l1.98.68V12a3 3 0 0 0 5.87.87l3.15 1.07A1.5 1.5 0 0 0 15 12.5zM5 11.22l3.92 1.33A2 2 0 0 1 5 12z" />
  </svg>
);

/** Fluent `person_add_16_regular`. */
export const FluentRefPersonAddIcon = () => (
  <svg {...base}>
    <path d="M6.22 13.96C3.55 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8h2.1q-.24.48-.4 1H3.5a.5.5 0 0 0-.5.5v.5c0 1.13.88 2.33 2.5 2.8q.3.63.72 1.16m3.4-8.9a2.75 2.75 0 1 0-3.3 1.86q.48-.56 1.08-.97a1.76 1.76 0 0 1-2.15-1.7 1.75 1.75 0 1 1 3 1.23q.65-.3 1.38-.41M10.5 15a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m0-7c.28 0 .5.22.5.5V10h1.5a.5.5 0 0 1 0 1H11v1.5a.5.5 0 0 1-1 0V11H8.5a.5.5 0 0 1 0-1H10V8.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `person_add_16_filled`. */
export const FluentRefPersonAddFilledIcon = () => (
  <svg {...base}>
    <path d="M9.63 5.07a5.5 5.5 0 0 0-3.3 1.85 2.75 2.75 0 1 1 3.3-1.85M5.6 8a5.5 5.5 0 0 0 .62 5.96C3.55 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8zm4.9 7a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m0-7c.28 0 .5.22.5.5V10h1.5a.5.5 0 0 1 0 1H11v1.5a.5.5 0 0 1-1 0V11H8.5a.5.5 0 0 1 0-1H10V8.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `history_16_regular`. */
export const FluentRefHistoryIcon = () => (
  <svg {...base}>
    <path d="M8 3a5 5 0 1 1-4.98 5.46.5.5 0 0 0-1 .08 6 6 0 1 0 1.48-4.5V2.5a.5.5 0 1 0-1 0v3c0 .28.22.5.5.5h3a.5.5 0 1 0 0-1H4a5 5 0 0 1 4-2m0 2.5a.5.5 0 1 0-1 0v3c0 .28.22.5.5.5h2a.5.5 0 1 0 0-1H8z" />
  </svg>
);

/** Fluent `history_16_filled`. */
export const FluentRefHistoryFilledIcon = () => (
  <svg {...base}>
    <path d="M8 3.5a4.5 4.5 0 1 1-4.45 5.14.75.75 0 0 0-1.49.21A6 6 0 1 0 4 3.53v-.78a.75.75 0 0 0-1.5 0v3c0 .41.34.75.75.75h2.5a.75.75 0 0 0 0-1.5h-1.1A4.5 4.5 0 0 1 8 3.5m.5 2.25a.75.75 0 0 0-1.5 0v2.5c0 .41.34.75.75.75h2a.75.75 0 0 0 0-1.5H8.5z" />
  </svg>
);

/** Fluent `save_16_regular`. */
export const FluentRefSaveIcon = () => (
  <svg {...base}>
    <path d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1V9.5C4 8.67 4.67 8 5.5 8h5c.83 0 1.5.67 1.5 1.5V13a1 1 0 0 0 1-1V5.62a1 1 0 0 0-.3-.7L11.1 3.28a1 1 0 0 0-.71-.29H10v1.5C10 5.33 9.33 6 8.5 6h-2A1.5 1.5 0 0 1 5 4.5V3zm2 0v1.5c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5V3zm5 10V9.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V13zM2 4c0-1.1.9-2 2-2h6.38a2 2 0 0 1 1.41.59l1.62 1.62A2 2 0 0 1 14 5.62V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
  </svg>
);

/** Fluent `save_16_filled`. */
export const FluentRefSaveFilledIcon = () => (
  <svg {...base}>
    <path d="M5 2v2.5C5 5.33 5.67 6 6.5 6h2c.83 0 1.5-.67 1.5-1.5V2h.38a2 2 0 0 1 1.41.59l1.62 1.62A2 2 0 0 1 14 5.62V12a2 2 0 0 1-2 2V9.5c0-.83-.67-1.5-1.5-1.5h-5C4.67 8 4 8.67 4 9.5V14a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zm1 0v2.5c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5V2zM5 14h6V9.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5z" />
  </svg>
);

/** Fluent `bug_16_regular`. */
export const FluentRefBugIcon = () => (
  <svg {...base}>
    <path d="M7.3 1.5a.5.5 0 0 0-1 0v.8q0 .44.2.8a2.5 2.5 0 0 0-1.74 1.85A1.1 1.1 0 0 1 4 3.9V2.5a.5.5 0 0 0-1 0v1.4a2.1 2.1 0 0 0 1.7 2.06V7H2.5a.5.5 0 0 0 0 1h2.2v1.7q0 .15.02.32A2 2 0 0 0 3 12v1.5a.5.5 0 0 0 1 0V12a1 1 0 0 1 .97-1 3.3 3.3 0 0 0 6.06 0 1 1 0 0 1 .97 1v1.5a.5.5 0 0 0 1 0V12a2 2 0 0 0-1.72-1.98l.02-.32V8h2.2a.5.5 0 0 0 0-1h-2.2V5.96A2.1 2.1 0 0 0 13 3.9V2.5a.5.5 0 0 0-1 0v1.4c0 .49-.32.9-.76 1.05A2.5 2.5 0 0 0 9.5 3.1q.2-.36.2-.8v-.8a.5.5 0 0 0-1 0v.8a.7.7 0 1 1-1.4 0zm-1.6 6v-2c0-.83.67-1.5 1.5-1.5h1.6c.83 0 1.5.67 1.5 1.5v4.2a2.3 2.3 0 0 1-4.6 0z" />
  </svg>
);

/** Fluent `bug_16_filled`. */
export const FluentRefBugFilledIcon = () => (
  <svg {...base}>
    <path d="M7.3 1.5a.5.5 0 0 0-1 0v.8q0 .44.2.8a2.5 2.5 0 0 0-1.74 1.85A1.1 1.1 0 0 1 4 3.9V2.5a.5.5 0 0 0-1 0v1.4a2.1 2.1 0 0 0 1.7 2.06V7H2.5a.5.5 0 0 0 0 1h2.2v1.7q0 .15.02.32A2 2 0 0 0 3 12v1.5a.5.5 0 0 0 1 0V12a1 1 0 0 1 .97-1 3.3 3.3 0 0 0 6.06 0 1 1 0 0 1 .97 1v1.5a.5.5 0 0 0 1 0V12a2 2 0 0 0-1.72-1.98l.02-.32V8h2.2a.5.5 0 0 0 0-1h-2.2V5.96A2.1 2.1 0 0 0 13 3.9V2.5a.5.5 0 0 0-1 0v1.4c0 .49-.32.9-.76 1.05A2.5 2.5 0 0 0 9.5 3.1q.2-.36.2-.8v-.8a.5.5 0 0 0-1 0v.8a.7.7 0 1 1-1.4 0z" />
  </svg>
);

/** Fluent `eyedropper_16_regular`. */
export const FluentRefEyedropperIcon = () => (
  <svg {...base}>
    <path d="M13.43 2.57q.28.28.42.63.15.36.15.74a2 2 0 0 1-.57 1.46l-.7.7.25.26a1.14 1.14 0 0 1 0 1.6l-.59.58a1.14 1.14 0 0 1-1.6 0l-.25-.25-4.94 4.93a.5.5 0 0 1-.35.15h-.53l-1.29.55a1.03 1.03 0 0 1-1.35-1.35l.55-1.29v-.53a.5.5 0 0 1 .15-.35l4.94-4.95-.26-.25a1.14 1.14 0 0 1 0-1.6l.6-.59a1.14 1.14 0 0 1 1.6 0l.25.26.7-.7A2 2 0 0 1 11.98 2a2 2 0 0 1 1.45.57m-5 3.6-4.8 4.78v.43a1 1 0 0 1-.03.2L3 12.96l1.41-.56a1 1 0 0 1 .2-.04h.43l4.79-4.79zm4.3-1.49q.12-.13.2-.3a1 1 0 0 0 .07-.36 1 1 0 0 0-.28-.74 1 1 0 0 0-.67-.28 1 1 0 0 0-.73.28l-1.05 1.05a.5.5 0 0 1-.71 0l-.61-.6-.05-.03-.05-.01h-.06l-.04.04-.58.58a.1.1 0 0 0-.04.1l.04.09 3.33 3.33.04.03.05.01a.1.1 0 0 0 .1-.04l.58-.58.03-.05.01-.05a.1.1 0 0 0-.04-.1l-.6-.6a.5.5 0 0 1 0-.7z" />
  </svg>
);

/** Fluent `eyedropper_16_filled`. */
export const FluentRefEyedropperFilledIcon = () => (
  <svg {...base}>
    <path d="M13.43 2.57q.28.28.42.63.15.36.15.74a2 2 0 0 1-.57 1.46l-.7.7.25.26a1.14 1.14 0 0 1 0 1.6l-.59.58a1.14 1.14 0 0 1-1.6 0l-.25-.25-4.94 4.93a.5.5 0 0 1-.35.15h-.53l-1.29.55a1.03 1.03 0 0 1-1.35-1.35l.55-1.29v-.53a.5.5 0 0 1 .15-.35l4.94-4.95-.26-.25a1.14 1.14 0 0 1 0-1.6l.6-.59a1.14 1.14 0 0 1 1.6 0l.25.26.7-.7A2 2 0 0 1 11.98 2a2 2 0 0 1 1.45.57m-5 3.6-4.8 4.78v.43a1 1 0 0 1-.03.2L3 12.96l1.41-.56a1 1 0 0 1 .2-.04h.43l4.79-4.79z" />
  </svg>
);

/** Fluent `paint_brush_16_regular`. */
export const FluentRefPaintbrushIcon = () => (
  <svg {...base}>
    <path d="M3.5 1a.5.5 0 0 0-.5.5V9c0 1.1.9 2 2 2h1v2a2 2 0 1 0 4 0v-2h1a2 2 0 0 0 2-2V1.5a.5.5 0 0 0-.5-.5zM4 7V2h4v1.5a.5.5 0 0 0 1 0V2h1v2.5a.5.5 0 0 0 1 0V2h1v5zm0 1h8v1a1 1 0 0 1-1 1H9.5a.5.5 0 0 0-.5.5V13a1 1 0 1 1-2 0v-2.5a.5.5 0 0 0-.5-.5H5a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `paint_brush_16_filled`. */
export const FluentRefPaintbrushFilledIcon = () => (
  <svg {...base}>
    <path d="M10 4.5V1H9v2.5a.5.5 0 0 1-1 0V1H3.5a.5.5 0 0 0-.5.5V7h10V1.5a.5.5 0 0 0-.5-.5H11v3.5a.5.5 0 0 1-1 0M13 8H3v1c0 1.1.9 2 2 2h1.5v2.5a1.5 1.5 0 0 0 3 0V11H11a2 2 0 0 0 2-2z" />
  </svg>
);

/** Fluent `puzzle_piece_16_regular`. */
export const FluentRefPuzzleIcon = () => (
  <svg {...base}>
    <path d="M7 3a2 2 0 0 1 4 0h1.5c.83 0 1.5.67 1.5 1.5V7h-1a1 1 0 0 0 0 2h1v2.5c0 .83-.67 1.5-1.5 1.5H11a2 2 0 0 1-4 0H5.5A1.5 1.5 0 0 1 4 11.5V10a2 2 0 0 1 0-4V4.5C4 3.67 4.67 3 5.5 3zm2-1a1 1 0 0 0-1 1v1H5.5a.5.5 0 0 0-.5.5V7H4a1 1 0 0 0 0 2h1v2.5c0 .28.22.5.5.5H8v1a1 1 0 0 0 2 0v-1h2.5a.5.5 0 0 0 .5-.5V10a2 2 0 0 1 0-4V4.5a.5.5 0 0 0-.5-.5H10V3a1 1 0 0 0-1-1" />
  </svg>
);

/** Fluent `puzzle_piece_16_filled`. */
export const FluentRefPuzzleFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1a2 2 0 0 0-2 2H5.5C4.67 3 4 3.67 4 4.5V6a2 2 0 0 0 0 4v1.5c0 .83.67 1.5 1.5 1.5H7a2 2 0 0 0 4 0h1.5c.83 0 1.5-.67 1.5-1.5V9h-1a1 1 0 1 1 0-2h1V4.5c0-.83-.67-1.5-1.5-1.5H11a2 2 0 0 0-2-2" />
  </svg>
);

/** Fluent `ruler_16_regular`. */
export const FluentRefRulerIcon = () => (
  <svg {...base}>
    <path d="M10.5 1c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 13.5v-11C4 1.67 4.67 1 5.5 1zm-5 1a.5.5 0 0 0-.5.5V4h2.5a.5.5 0 0 1 0 1H5v1.5h3.5a.5.5 0 0 1 0 1H5V9h2.5a.5.5 0 0 1 0 1H5v1.5h3.5a.5.5 0 0 1 0 1H5v1c0 .28.22.5.5.5h5a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5z" />
  </svg>
);

/** Fluent `ruler_16_filled`. */
export const FluentRefRulerFilledIcon = () => (
  <svg {...base}>
    <path d="M10.5 1c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 13.5v-11C4 1.67 4.67 1 5.5 1zM5 12.5h3.5a.5.5 0 0 0 0-1H5zM5 10h2.5a.5.5 0 0 0 0-1H5zm0-2.5h3.5a.5.5 0 0 0 0-1H5zM5 5h2.5a.5.5 0 0 0 0-1H5z" />
  </svg>
);

/** Fluent `alert_off_16_regular`. */
export const FluentRefBellOffIcon = () => (
  <svg {...base}>
    <path d="m11.3 12 2.85 2.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L3.9 4.62A4.5 4.5 0 0 0 3.5 6.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h3a2 2 0 1 0 4 0zm-1-1H3.73l.72-1.82L4.5 9V6.5q0-.58.18-1.11zM8 13a1 1 0 0 1-1-1h2a1 1 0 0 1-1 1m3.69-3.43-.15-.39L11.5 9V6.5a3.5 3.5 0 0 0-5.64-2.77l-.72-.7A4.5 4.5 0 0 1 12.5 6.5v2.4l.96 2.4.02.05z" />
  </svg>
);

/** Fluent `alert_off_16_filled`. */
export const FluentRefBellOffFilledIcon = () => (
  <svg {...base}>
    <path d="m11.3 12 2.85 2.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L3.9 4.62A4.5 4.5 0 0 0 3.5 6.5v2.4l-.96 2.41A.5.5 0 0 0 3 12zm2.16-.69.02.05-8.34-8.34A4.5 4.5 0 0 1 12.5 6.5v2.4zM8 14.5A2 2 0 0 1 6.06 13h3.88A2 2 0 0 1 8 14.5" />
  </svg>
);

/** Fluent `mic_off_16_regular`. */
export const FluentRefMicOffIcon = () => (
  <svg {...base}>
    <path d="m10.8 11.52 3.35 3.33a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L5.5 6.21V8a2.5 2.5 0 0 0 3.88 2.09l.72.71A3.5 3.5 0 0 1 4.5 8a.5.5 0 1 0-1 0 4.5 4.5 0 0 0 4 4.47v1.03a.5.5 0 1 0 1 0v-1.03q1.32-.17 2.3-.95M8.66 9.35q-.3.15-.65.15A1.5 1.5 0 0 1 6.5 8v-.8zm.85-1.97V4.5a1.5 1.5 0 0 0-3-.12l-.82-.82a2.5 2.5 0 0 1 4.82.94V8q0 .18-.02.35zm2.56 2.56-.76-.76q.2-.56.2-1.18a.5.5 0 0 1 1 0q-.01 1.05-.44 1.94" />
  </svg>
);

/** Fluent `mic_off_16_filled`. */
export const FluentRefMicOffFilledIcon = () => (
  <svg {...base}>
    <path d="m10.8 11.52 3.35 3.33a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L5.5 6.21V8a2.5 2.5 0 0 0 3.88 2.09l.72.71A3.5 3.5 0 0 1 4.5 8a.5.5 0 1 0-1 0 4.5 4.5 0 0 0 4 4.47v1.03a.5.5 0 1 0 1 0v-1.03q1.32-.17 2.3-.95m1.26-1.58-.76-.76q.2-.56.2-1.18a.5.5 0 0 1 1 0q-.01 1.05-.44 1.94m-1.58-1.59-4.8-4.79a2.5 2.5 0 0 1 4.82.94V8q0 .18-.02.35" />
  </svg>
);

/** Fluent `video_off_16_regular`. */
export const FluentRefVideoOffIcon = () => (
  <svg {...base}>
    <path d="m10.8 11.5 3.35 3.35a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L2.5 3.21A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h5a2.5 2.5 0 0 0 2.3-1.5m-.81-.8A1.5 1.5 0 0 1 8.5 12h-5A1.5 1.5 0 0 1 2 10.5v-5c0-.76.57-1.4 1.3-1.49zM10 5.5v2.38l1 1V6.84l2.6-1.8c.17-.1.4.01.4.21v5.5c0 .2-.23.32-.4.2l-1.7-1.17 2.18 2.18c.5-.15.92-.6.92-1.21v-5.5c0-1-1.14-1.6-1.96-1.03L11 5.62V5.5A2.5 2.5 0 0 0 8.5 3H5.12l1 1H8.5c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `video_off_16_filled`. */
export const FluentRefVideoOffFilledIcon = () => (
  <svg {...base}>
    <path d="m10 10.7 4.15 4.15a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L2.5 3.21A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h4a2.5 2.5 0 0 0 2.5-2.3m.92-1.9 3.16 3.16c.5-.15.92-.6.92-1.21v-5.5c0-1-1.14-1.6-1.96-1.03L10.9 5.7l.02.28zM5.12 3 10 7.88V5.5A2.5 2.5 0 0 0 7.5 3z" />
  </svg>
);

/** Fluent `calculator_16_regular`. */
export const FluentRefCalculatorIcon = () => (
  <svg {...base}>
    <path d="M6 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-4-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5.5 3C4.67 3 4 3.67 4 4.5v1C4 6.33 4.67 7 5.5 7h5c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5zM5 4.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zm9 8a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-9A2.5 2.5 0 0 1 4.5 1h7A2.5 2.5 0 0 1 14 3.5zm-1-9c0-.83-.67-1.5-1.5-1.5h-7C3.67 2 3 2.67 3 3.5v9c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5z" />
  </svg>
);

/** Fluent `calculator_16_filled`. */
export const FluentRefCalculatorFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 1h-7A2.5 2.5 0 0 0 2 3.5v9A2.5 2.5 0 0 0 4.5 15h7a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 11.5 1m-6 2h5c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 5.5v-1C4 3.67 4.67 3 5.5 3M6 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-4-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `hat_graduation_16_regular`. */
export const FluentRefGraduationCapIcon = () => (
  <svg {...base}>
    <path d="M9.37 2.45a2.5 2.5 0 0 0-2.74 0l-5.4 3.53a.5.5 0 0 0-.23.47v4.05a.5.5 0 0 0 1 0V7.34l1 .68v3.68q0 .18.12.32v.01l.03.03.32.32q.33.32.96.74A6.6 6.6 0 0 0 8 14.2a6.6 6.6 0 0 0 4.53-1.82l.32-.32.02-.03h.01a.5.5 0 0 0 .12-.33V8.02l1.78-1.2q.21-.13.22-.42a.5.5 0 0 0-.23-.42zM12 8.7v2.8a5 5 0 0 1-.97.78c-.72.46-1.75.92-3.03.92a5.6 5.6 0 0 1-4-1.7V8.7l2.6 1.75a2.5 2.5 0 0 0 2.8 0zm-8.5 3-.38.32zm3.68-8.42a1.5 1.5 0 0 1 1.64 0L13.6 6.4 8.84 9.63a1.5 1.5 0 0 1-1.68 0L2.4 6.4z" />
  </svg>
);

/** Fluent `hat_graduation_16_filled`. */
export const FluentRefGraduationCapFilledIcon = () => (
  <svg {...base}>
    <path d="M6.63 2.45a2.5 2.5 0 0 1 2.74 0l5.4 3.53a.5.5 0 0 1 .01.83L9.4 10.45a2.5 2.5 0 0 1-2.8 0L2 7.35v3.15a.5.5 0 1 1-1 0V6.45a.5.5 0 0 1 .23-.47zM3 11.5V9.23l3.04 2.05c1.18.8 2.74.8 3.92 0L13 9.23v2.27a.5.5 0 0 1-.12.32l-.38-.32.38.32v.01l-.03.03-.32.32q-.33.32-.96.74A6.6 6.6 0 0 1 8 14a6.6 6.6 0 0 1-4.53-1.82l-.32-.32-.02-.03h-.01l.38-.33-.38.32A.5.5 0 0 1 3 11.5" />
  </svg>
);

/** Fluent `vehicle_car_16_regular`. */
export const FluentRefCarIcon = () => (
  <svg {...base}>
    <path d="M6 9a.75.75 0 1 1-1.5 0A.75.75 0 0 1 6 9m4.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M3.03 6.07 3.04 6H2.5a.5.5 0 0 1 0-1h.67l.17-1.26A2 2 0 0 1 5.32 2h5.36a2 2 0 0 1 1.98 1.75L12.82 5h.68a.5.5 0 0 1 0 1h-.55l.01.07c.6.2 1.04.76 1.04 1.43v3c0 .83-.67 1.5-1.5 1.5v1.25a.75.75 0 1 1-1.5 0V12H5v1.25a.75.75 0 0 1-1.5 0V12A1.5 1.5 0 0 1 2 10.5v-3c0-.67.43-1.23 1.03-1.43m1.3-2.2L4.05 6h7.9l-.28-2.13a1 1 0 0 0-1-.87H5.33a1 1 0 0 0-1 .87M12.5 11a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v3c0 .28.22.5.5.5z" />
  </svg>
);

/** Fluent `vehicle_car_16_filled`. */
export const FluentRefCarFilledIcon = () => (
  <svg {...base}>
    <path d="M3.04 6v.07C2.43 6.27 2 6.83 2 7.5v3c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-3a1.5 1.5 0 0 0-1.04-1.43V6h.54a.5.5 0 0 0 0-1h-.68l-.16-1.25A2 2 0 0 0 10.68 2H5.32a2 2 0 0 0-1.98 1.74L3.17 5H2.5a.5.5 0 0 0 0 1zm2.28-3h5.36a1 1 0 0 1 1 .87L11.93 6H4.05l.28-2.13A1 1 0 0 1 5.32 3m-.07 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m5.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M12.5 13H11v.25a.75.75 0 0 0 1.5 0zM5 13H3.5v.25a.75.75 0 0 0 1.5 0z" />
  </svg>
);

/** Fluent `box_16_regular`. */
export const FluentRefPackageIcon = () => (
  <svg {...base}>
    <path d="M6.92 1.38a3 3 0 0 1 2.16 0l4.96 1.9c.58.23.96.79.96 1.4v6.63a1.5 1.5 0 0 1-.96 1.4l-4.96 1.91a3 3 0 0 1-2.16 0l-4.96-1.9a1.5 1.5 0 0 1-.96-1.4V4.68c0-.62.38-1.18.96-1.4zm1.8.93a2 2 0 0 0-1.44 0l-1.38.53 5.59 2.12 1.95-.83zM14 4.97 8.5 7.33v6.43l.22-.07 4.96-1.91a.5.5 0 0 0 .32-.47zm-6.5 8.79V7.33L2 4.97v6.34c0 .2.13.4.32.47l4.96 1.9zM2.56 4.13 8 6.46l2.16-.93L4.5 3.38z" />
  </svg>
);

/** Fluent `box_16_filled`. */
export const FluentRefPackageFilledIcon = () => (
  <svg {...base}>
    <path d="m4.04 2.49 6.6 2.83L8 6.46 1.43 3.64q.22-.23.53-.35zm1.33-.52 1.55-.6a3 3 0 0 1 2.16 0l4.96 1.92q.31.12.53.35l-2.65 1.14zM15 4.55 8.5 7.33v7.45a3 3 0 0 0 .58-.16l4.96-1.9c.58-.23.96-.79.96-1.4V4.54M7.5 14.78V7.33L1 4.55v6.76c0 .62.38 1.18.96 1.4l4.96 1.91a3 3 0 0 0 .58.16" />
  </svg>
);

/** Fluent `wifi_off_20_regular`. */
export const FluentRefWifiOffIcon = () => (
  <svg {...base}>
    <path d="M2.85 2.15a.5.5 0 1 0-.7.7l3.03 3.03a10 10 0 0 0-3.06 2.86.5.5 0 0 0 .82.57q.48-.68 1-1.22.91-.9 1.97-1.47l1.44 1.43A6.4 6.4 0 0 0 4.28 11a.5.5 0 1 0 .9.45A5.4 5.4 0 0 1 8.1 8.82l1.86 1.85a4 4 0 0 0-3.63 2.43.5.5 0 0 0 .92.4q.24-.54.63-.94c.9-.9 2.2-1.11 3.3-.66l1.65 1.65a.5.5 0 0 0 .2.2l4.1 4.1a.5.5 0 0 0 .71-.7zM9.6 7.48l1.02 1.02a5.4 5.4 0 0 1 4.28 2.97.5.5 0 0 0 .9-.46A6.43 6.43 0 0 0 9.6 7.48M7.14 5.01l.8.81a8.6 8.6 0 0 1 9.2 3.5.5.5 0 0 0 .83-.57A9.61 9.61 0 0 0 7.14 5.02m3.82 8.78a1.3 1.3 0 1 1-1.83 1.83 1.3 1.3 0 0 1 1.83-1.83" />
  </svg>
);

/** Fluent `wifi_off_20_filled`. */
export const FluentRefWifiOffFilledIcon = () => (
  <svg {...base}>
    <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l2.89 2.89A9.5 9.5 0 0 0 2.24 8.9a.75.75 0 1 0 1.23.86q.43-.65.93-1.14.83-.83 1.8-1.35l.97.96A6.4 6.4 0 0 0 4.3 11.1a.75.75 0 0 0 1.34.67 5 5 0 0 1 2.68-2.4l1.28 1.28a4.1 4.1 0 0 0-3.34 2.46.75.75 0 1 0 1.38.6q.2-.46.54-.8a2.6 2.6 0 0 1 3.38-.3l5.17 5.17a.75.75 0 1 0 1.06-1.06zm8.09 7.03a5 5 0 0 1 3.08 2.54.75.75 0 1 0 1.33-.69A6.43 6.43 0 0 0 9.7 7.57zM8.55 6.43a8 8 0 0 1 8.06 3.33.75.75 0 1 0 1.23-.85A9.47 9.47 0 0 0 7.31 5.19zm2.37 9.2a1.24 1.24 0 1 0-1.76-1.75 1.24 1.24 0 0 0 1.76 1.76" />
  </svg>
);

/** Fluent `link_dismiss_16_regular`. */
export const FluentRefLinkOffIcon = () => (
  <svg {...base}>
    <path d="M10.5 3H9.41a.5.5 0 0 0 .09 1h1.16a2.5 2.5 0 0 1 2.32 2.2q.54.15 1.02.4v-.1A3.5 3.5 0 0 0 10.5 3M6.6 9q-.24.48-.4 1h-.7a3.5 3.5 0 0 1-.2-7h1.2a.5.5 0 0 1 .09 1H5.5a2.5 2.5 0 0 0-.16 5H6.6m4.12-2.95q-1.33.2-2.38.95H5.5a.5.5 0 0 1-.09-1h5.09a1 1 0 0 1 .22.05M11.5 16a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m1.85-6.35c.2.2.2.5 0 .7l-1.14 1.15 1.14 1.15a.5.5 0 0 1-.7.7l-1.15-1.14-1.15 1.14a.5.5 0 0 1-.7-.7l1.14-1.15-1.14-1.15a.5.5 0 0 1 .7-.7l1.15 1.14 1.15-1.14c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `link_dismiss_16_filled`. */
export const FluentRefLinkOffFilledIcon = () => (
  <svg {...base}>
    <path d="M10.27 3h-.62a.75.75 0 0 0 .1 1.5h.67c.93.07 1.7.7 1.98 1.57q.85.15 1.6.53c-.08-2-1.72-3.6-3.73-3.6m-3.7 6.07q-.35.68-.48 1.43h-.34a3.75 3.75 0 0 1-.2-7.5h.7a.75.75 0 0 1 .1 1.5h-.6A2.25 2.25 0 0 0 5.6 9h.65q.17 0 .31.07m4.01-3c-1.1.2-2.08.7-2.85 1.43H5.75a.75.75 0 0 1-.1-1.5h4.6q.18 0 .33.08M11.5 16a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m1.85-6.35c.2.2.2.5 0 .7l-1.14 1.15 1.14 1.15a.5.5 0 0 1-.7.7l-1.15-1.14-1.15 1.14a.5.5 0 0 1-.7-.7l1.14-1.15-1.14-1.15a.5.5 0 0 1 .7-.7l1.15 1.14 1.15-1.14c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `cloud_arrow_up_16_regular`. */
export const FluentRefCloudUploadIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.77q.05.51.19 1h-.96a3.25 3.25 0 0 1-.22-6.5 4 4 0 0 1 7.89-.32q-.52-.14-1.09-.17A3 3 0 0 0 8 3m7 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85-2.35-2 2a.5.5 0 0 0 .7.7L10 9.71v2.79a.5.5 0 0 0 1 0V9.7l1.15 1.15a.5.5 0 0 0 .7-.7l-2-2A.5.5 0 0 0 10.5 8a.5.5 0 0 0-.35.14" />
  </svg>
);

/** Fluent `cloud_arrow_up_16_filled`. */
export const FluentRefCloudUploadFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.89-.32A5.5 5.5 0 0 0 5.2 12h-.96a3.25 3.25 0 0 1-.22-6.5m10.97 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85-2.35-2 2a.5.5 0 0 0 .7.7L10 9.71v2.79a.5.5 0 0 0 1 0V9.7l1.15 1.15a.5.5 0 0 0 .7-.7l-2-2A.5.5 0 0 0 10.5 8a.5.5 0 0 0-.35.14" />
  </svg>
);

/** Fluent `key_command_16_regular`. */
export const FluentRefCommandIcon = () => (
  <svg {...base}>
    <path d="M6 4v1h4V4a2 2 0 1 1 2 2h-1v4h1a2 2 0 1 1-2 2v-1H6v1a2 2 0 1 1-2-2h1V6H4a2 2 0 1 1 2-2M5 5V4a1 1 0 1 0-1 1zm5 5V6H6v4zm1 1v1a1 1 0 1 0 1-1zm1-6a1 1 0 1 0-1-1v1zm-7 6H4a1 1 0 1 0 1 1z" />
  </svg>
);

/** Fluent `key_command_16_filled`. */
export const FluentRefCommandFilledIcon = () => (
  <svg {...base}>
    <path d="M1.5 4a2.5 2.5 0 0 1 5 0v1h3V4A2.5 2.5 0 1 1 12 6.5h-1v3h1A2.5 2.5 0 1 1 9.5 12v-1h-3v1A2.5 2.5 0 1 1 4 9.5h1v-3H4A2.5 2.5 0 0 1 1.5 4m9.5 7v1a1 1 0 1 0 1-1zM9.5 9.5v-3h-3v3zM12 5a1 1 0 1 0-1-1v1zm-7 6H4a1 1 0 1 0 1 1zm0-7a1 1 0 1 0-1 1h1z" />
  </svg>
);

/** Fluent `arrow_enter_left_20_regular`. */
export const FluentRefReturnIcon = () => (
  <svg {...base}>
    <path d="m3.76 12 3.33 3.14a.5.5 0 0 1-.68.72l-4.25-4a.5.5 0 0 1 0-.72l4.25-4a.5.5 0 1 1 .68.72L3.76 11H15a2 2 0 0 0 2-2V4.5a.5.5 0 0 1 1 0V9a3 3 0 0 1-3 3z" />
  </svg>
);

/** Fluent `arrow_enter_left_20_filled`. */
export const FluentRefReturnFilledIcon = () => (
  <svg {...base}>
    <path d="m4.64 12.5 2.87 2.7a.75.75 0 0 1-1.02 1.1l-4.25-4a.75.75 0 0 1 0-1.1l4.25-4A.75.75 0 1 1 7.5 8.3L4.64 11h10.11c.97 0 1.75-.78 1.75-1.75v-4.5a.75.75 0 0 1 1.5 0v4.5c0 1.8-1.46 3.25-3.25 3.25z" />
  </svg>
);

/** Fluent `backspace_16_regular`. */
export const FluentRefBackspaceIcon = () => (
  <svg {...base}>
    <path d="M6 3a2 2 0 0 0-1.41.59l-3 3a2 2 0 0 0 0 2.82l3 3A2 2 0 0 0 6 13h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-.7 1.3A1 1 0 0 1 6 4h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-.7-.3l-3-3a1 1 0 0 1 0-1.4zm2.05 1.35a.5.5 0 1 0-.7.7L8.29 8 6.65 9.65a.5.5 0 0 0 .7.7L9 8.71l1.65 1.64a.5.5 0 0 0 .7-.7L9.71 8l1.64-1.65a.5.5 0 0 0-.7-.7L9 7.29z" />
  </svg>
);

/** Fluent `backspace_16_filled`. */
export const FluentRefBackspaceFilledIcon = () => (
  <svg {...base}>
    <path d="M4.59 3.59A2 2 0 0 1 6 3h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-1.41-.59l-3-3a2 2 0 0 1 0-2.82zm2.76 2.06a.5.5 0 1 0-.7.7L8.29 8 6.65 9.65a.5.5 0 0 0 .7.7L9 8.71l1.65 1.64a.5.5 0 0 0 .7-.7L9.71 8l1.64-1.65a.5.5 0 0 0-.7-.7L9 7.29z" />
  </svg>
);

/** Fluent `rocket_16_regular`. */
export const FluentRefRocketIcon = () => (
  <svg {...base}>
    <path d="M4.9 12.9a.5.5 0 0 1 .7.7l-.75.75a.5.5 0 0 1-.7-.7zm-1.25-1.25a.5.5 0 0 1 .7.7l-1.5 1.5a.5.5 0 1 1-.7-.7zM12.5 1A2.5 2.5 0 0 1 15 3.5v.43a5.5 5.5 0 0 1-1.61 3.89l-.51.5c.5.95.36 2.15-.44 2.95l-1.09 1.08a.5.5 0 0 1-.7 0l-.95-.94a1.5 1.5 0 0 1-1.76-.26l-.36-.37-.66 1a.5.5 0 0 1-.77.07l-2-2a.5.5 0 0 1 .07-.77l1-.66-.37-.36A1.5 1.5 0 0 1 4.6 6.3l-.94-.95a.5.5 0 0 1 0-.7l1.08-1.09c.8-.8 2-.94 2.94-.44l.51-.5A5.5 5.5 0 0 1 12.08 1zM2.4 10.4a.5.5 0 0 1 .7.7l-.75.75a.5.5 0 0 1-.7-.7zm8.06.35.54.54.73-.73c.4-.4.53-.96.38-1.47zM5.28 9.58l1.14 1.13.44-.65-.92-.92zM12.08 2a4.5 4.5 0 0 0-3.2 1.32L5.57 6.65a.5.5 0 0 0 0 .7l3.09 3.09c.2.2.5.2.7 0l3.33-3.33A4.5 4.5 0 0 0 14 3.93V3.5c0-.83-.67-1.5-1.5-1.5zM10 4.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5m0 1a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M6.9 3.88a1.5 1.5 0 0 0-1.46.39L4.7 5l.54.54z" />
  </svg>
);

/** Fluent `rocket_16_filled`. */
export const FluentRefRocketFilledIcon = () => (
  <svg {...base}>
    <path d="M5.15 12.65a.5.5 0 0 1 .7.7l-1 1a.5.5 0 0 1-.7-.7zm-1.5-1a.5.5 0 0 1 .7.7l-1.5 1.5a.5.5 0 1 1-.7-.7zM12.5 1A2.5 2.5 0 0 1 15 3.5v.43a5.5 5.5 0 0 1-1.61 3.89l-.51.5c.5.95.36 2.15-.44 2.95l-1.09 1.08a.5.5 0 0 1-.7 0l-.95-.94a1.5 1.5 0 0 1-1.76-.26l-.36-.37-.66 1a.5.5 0 0 1-.77.07l-2-2a.5.5 0 0 1 .07-.77l1-.66-.37-.36A1.5 1.5 0 0 1 4.6 6.3l-.94-.95a.5.5 0 0 1 0-.7l1.08-1.09c.8-.8 2-.94 2.94-.44l.51-.5A5.5 5.5 0 0 1 12.08 1zm-9.85 9.15a.5.5 0 1 1 .7.7l-1 1a.5.5 0 1 1-.7-.7zM12.07 2A4.5 4.5 0 0 0 8.9 3.32L5.56 6.65a.5.5 0 0 0 0 .7l3.09 3.09c.2.2.5.2.7 0l3.33-3.33A4.5 4.5 0 0 0 14 3.93V3.5c0-.83-.67-1.5-1.5-1.5zM10 4.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5m0 1a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5" />
  </svg>
);

/** Fluent `next_16_regular`. */
export const FluentRefSkipForwardIcon = () => (
  <svg {...base}>
    <path d="M14 2.5a.5.5 0 1 0-1 0v11a.5.5 0 0 0 1 0zM2 3a1 1 0 0 1 1.58-.81l7 4.96a1 1 0 0 1 0 1.63l-7 5.03a1 1 0 0 1-1.58-.8zm8 4.96L3 3v10z" />
  </svg>
);

/** Fluent `next_16_filled`. */
export const FluentRefSkipForwardFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3a1 1 0 0 1 1.58-.81l7 4.96a1 1 0 0 1 0 1.63l-7 5.03a1 1 0 0 1-1.58-.8zm12-.5a.5.5 0 1 0-1 0v11a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `previous_16_regular`. */
export const FluentRefSkipBackIcon = () => (
  <svg {...base}>
    <path d="M2 2.5a.5.5 0 0 1 1 0v11a.5.5 0 0 1-1 0zM14 3a1 1 0 0 0-1.58-.81l-7 4.96a1 1 0 0 0 0 1.63l7 5.03a1 1 0 0 0 1.58-.8zM6 7.96 13 3v10z" />
  </svg>
);

/** Fluent `previous_16_filled`. */
export const FluentRefSkipBackFilledIcon = () => (
  <svg {...base}>
    <path d="M14 3a1 1 0 0 0-1.58-.81l-7 4.96a1 1 0 0 0 0 1.63l7 5.03a1 1 0 0 0 1.58-.8zM2 2.5a.5.5 0 0 1 1 0v11a.5.5 0 0 1-1 0z" />
  </svg>
);

/** Fluent `stop_16_regular`. */
export const FluentRefStopIcon = () => (
  <svg {...base}>
    <path d="M12.5 3c.28 0 .5.22.5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5zm-9-1C2.67 2 2 2.67 2 3.5v9c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `stop_16_filled`. */
export const FluentRefStopFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v9c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `arrow_repeat_all_16_regular`. */
export const FluentRefRepeatIcon = () => (
  <svg {...base}>
    <path d="M12.9 5.24a3.99 3.99 0 0 1-2.7 6.75L10 12H6.7l1.16 1.15c.17.17.19.44.05.64l-.05.07a.5.5 0 0 1-.64.05l-.07-.05-2-2a.5.5 0 0 1-.06-.64l.06-.07 2-2a.5.5 0 0 1 .76.63l-.05.07L6.7 11H10a3 3 0 0 0 3-2.82V8a3 3 0 0 0-.87-2.1.5.5 0 0 1 .69-.72zM8.77 2.09l.07.05 2 2 .06.08a.5.5 0 0 1 0 .56l-.05.07-2 2-.08.06a.5.5 0 0 1-.56 0l-.07-.05-.06-.07a.5.5 0 0 1 0-.57l.06-.07L9.29 5H6a3 3 0 0 0-3 2.82V8c0 .82.33 1.56.86 2.1a.5.5 0 0 1-.71.7A4 4 0 0 1 5.8 4h3.5L8.14 2.85l-.06-.07a.5.5 0 0 1 .7-.7" />
  </svg>
);

/** Fluent `arrow_repeat_all_16_filled`. */
export const FluentRefRepeatFilledIcon = () => (
  <svg {...base}>
    <path d="M12.75 5.51q.4.01.62.33l.04.06q.57.93.59 2.1a4 4 0 0 1-3.8 4H7.55l.73.72c.26.27.29.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07-2-2a.75.75 0 0 1-.08-.98l.08-.08 2-2a.75.75 0 0 1 1.13.97l-.07.09-.72.72H10a2.5 2.5 0 0 0 2.5-2.34V8q0-.76-.4-1.34a.75.75 0 0 1 .64-1.14m-5.03-3.3a.75.75 0 0 1 .98-.06l.08.07 2 2 .07.08c.2.26.2.62.01.89l-.08.09-2 2-.08.07c-.26.2-.62.2-.89.01l-.09-.08-.07-.08a.75.75 0 0 1-.01-.88l.08-.1.72-.72H6a2.5 2.5 0 0 0-2.5 2.34V8q0 .64.29 1.17l.1.18q.1.17.11.38a.75.75 0 0 1-1.39.4A4 4 0 0 1 5.8 4L6 4h2.44l-.72-.72-.07-.09a.75.75 0 0 1 .07-.97" />
  </svg>
);

/** Fluent `person_delete_16_regular`. */
export const FluentRefPersonRemoveIcon = () => (
  <svg {...base}>
    <path d="M9.5 9c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C1 9.67 1.67 9 2.5 9zm0 1h-7a.5.5 0 0 0-.5.5v.5c0 1.44 1.43 3 4 3s4-1.56 4-3v-.5a.5.5 0 0 0-.5-.5M6 2.5A2.75 2.75 0 1 1 6 8a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 6 7a1.75 1.75 0 0 0 0-3.5m4.78-2.41.07.06 1.65 1.64 1.65-1.64a.5.5 0 0 1 .7.7L13.21 3.5l1.64 1.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06-1.65-1.64-1.65 1.64a.5.5 0 0 1-.7-.7l1.64-1.65-1.64-1.65a.5.5 0 0 1-.06-.63l.06-.07a.5.5 0 0 1 .56-.1z" />
  </svg>
);

/** Fluent `person_delete_16_filled`. */
export const FluentRefPersonRemoveFilledIcon = () => (
  <svg {...base}>
    <path d="M9.5 9c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C1 9.67 1.67 9 2.5 9zM6 2.5A2.75 2.75 0 1 1 6 8a2.75 2.75 0 0 1 0-5.5m4.78-1.41.07.06 1.65 1.64 1.65-1.64a.5.5 0 0 1 .7.7L13.21 3.5l1.64 1.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06-1.65-1.64-1.65 1.64a.5.5 0 0 1-.7-.7l1.64-1.65-1.64-1.65a.5.5 0 0 1-.06-.63l.06-.07a.5.5 0 0 1 .56-.1z" />
  </svg>
);

/** Fluent `clipboard_16_regular`. */
export const FluentRefClipboardIcon = () => (
  <svg {...base}>
    <path d="M5.09 2c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h.59c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-10C3 2.67 3.67 2 4.5 2zM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM5.09 3H4.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5h-.59c-.2.58-.76 1-1.41 1h-3a1.5 1.5 0 0 1-1.41-1" />
  </svg>
);

/** Fluent `clipboard_16_filled`. */
export const FluentRefClipboardFilledIcon = () => (
  <svg {...base}>
    <path d="M5.09 2c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h.59c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-10C3 2.67 3.67 2 4.5 2zM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `note_16_regular`. */
export const FluentRefStickyNoteIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h3.67c.66 0 1.3-.26 1.77-.73l3.33-3.33c.47-.47.73-1.1.73-1.77V4.5A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5V8h-2.5A2.5 2.5 0 0 0 8 10.5V13H4.5A1.5 1.5 0 0 1 3 11.5zm6 8.25V10.5c0-.83.67-1.5 1.5-1.5h2.25l-.19.23-3.33 3.33z" />
  </svg>
);

/** Fluent `note_16_filled`. */
export const FluentRefStickyNoteFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5V8h-3.5A2.5 2.5 0 0 0 8 10.5V14H4.5A2.5 2.5 0 0 1 2 11.5zm7 9.36q.53-.18.94-.6l3.33-3.32q.4-.41.59-.94H10.5C9.67 9 9 9.67 9 10.5z" />
  </svg>
);

/** Fluent `arrow_trending_16_regular`. */
export const FluentRefTrendingUpIcon = () => (
  <svg {...base}>
    <path d="M8.5 4h5.04l.09.02.06.02.06.03.06.04.06.05.04.05.04.06.03.08.01.04.01.09V9.5a.5.5 0 0 1-.99.09V5.7l-5.15 5.15a.5.5 0 0 1-.64.06l-.07-.06L5.5 9.21l-2.65 2.64a.5.5 0 0 1-.76-.63l.06-.07 3-3a.5.5 0 0 1 .63-.06l.07.06L7.5 9.79 12.3 5H8.5a.5.5 0 0 1-.5-.41V4.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `arrow_trending_16_filled`. */
export const FluentRefTrendingUpFilledIcon = () => (
  <svg {...base}>
    <path d="M8.75 4h4.55l.1.02.12.03.1.05.04.02.05.03.07.07.09.1.06.1.04.1.02.1.01.13v4.5a.75.75 0 0 1-1.5.1V6.57l-4.22 4.22a.75.75 0 0 1-.98.08l-.08-.08-1.47-1.47-2.47 2.47a.75.75 0 0 1-1.13-.98l.07-.08 3-3c.26-.27.68-.3.98-.07l.08.07 1.47 1.47 3.7-3.69h-2.7a.75.75 0 0 1-.74-.65L8 4.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `shopping_bag_16_regular`. */
export const FluentRefShoppingBagIcon = () => (
  <svg {...base}>
    <path d="M5 5V3a2 2 0 0 1 3-1.73A2 2 0 0 1 11 3v2h.5c.83 0 1.5.67 1.5 1.5V13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5C3 5.67 3.67 5 4.5 5zm1-2v2h2V3a1 1 0 0 0-2 0m5 11a1 1 0 0 0 1-1V6.5a.5.5 0 0 0-.5-.5H10v7a1 1 0 0 0 1 1M9 6H4.5a.5.5 0 0 0-.5.5V13a1 1 0 0 0 1 1h4.27A2 2 0 0 1 9 13zm0-3v2h1V3a1 1 0 0 0-1.25-.97A2 2 0 0 1 9 3" />
  </svg>
);

/** Fluent `shopping_bag_16_filled`. */
export const FluentRefShoppingBagFilledIcon = () => (
  <svg {...base}>
    <path d="M5 5V3a2 2 0 0 1 3-1.73A2 2 0 0 1 11 3v2h.5c.83 0 1.5.67 1.5 1.5v7a1.5 1.5 0 0 1-3 0V3a1 1 0 0 0-1.25-.97A2 2 0 0 1 9 3v10.5q.02.86.5 1.5H5a2 2 0 0 1-2-2V6.5C3 5.67 3.67 5 4.5 5zm2-3a1 1 0 0 0-1 1v2h2V3a1 1 0 0 0-1-1" />
  </svg>
);

/** Fluent `cloud_arrow_down_16_regular`. */
export const FluentRefCloudDownloadIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.77q.05.51.19 1h-.96a3.25 3.25 0 0 1-.22-6.5 4 4 0 0 1 7.89-.32q-.52-.14-1.09-.17A3 3 0 0 0 8 3m7 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85 2.35a.5.5 0 0 0 .35.15.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.7-.7L11 11.29V8.5a.5.5 0 0 0-1 0v2.8l-1.15-1.15a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `cloud_arrow_down_16_filled`. */
export const FluentRefCloudDownloadFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.89-.32A5.5 5.5 0 0 0 5.2 12h-.96a3.25 3.25 0 0 1-.22-6.5m10.97 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85 2.35a.5.5 0 0 0 .35.15.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.7-.7L11 11.29V8.5a.5.5 0 0 0-1 0v2.8l-1.15-1.15a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `calendar_add_16_regular`. */
export const FluentRefCalendarAddIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m4.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `calendar_add_16_filled`. */
export const FluentRefCalendarAddFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm2 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `folder_add_16_regular`. */
export const FluentRefFolderAddIcon = () => (
  <svg {...base}>
    <path d="M2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3H3.5C2.67 3 2 3.67 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v.76a6 6 0 0 0-1-.66v-.1c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7H2v4.5c0 .83.67 1.5 1.5 1.5h2.7q.16.52.4 1H3.5A2.5 2.5 0 0 1 1 11.5zm15 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `folder_add_16_filled`. */
export const FluentRefFolderAddFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1zM1 7v4.5A2.5 2.5 0 0 0 3.5 14h3.1q-.58-1.14-.6-2.5a5.5 5.5 0 0 1 9-4.24V6.5A2.5 2.5 0 0 0 12.5 4H9.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7zm15 4.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `document_add_16_regular`. */
export const FluentRefDocumentAddIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.2q.49-.13 1-.18V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1H9.74q-.47.58-1.08 1H12a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06l-2.91-2.91A1.5 1.5 0 0 0 9.59 1zm6.8 4h-2.3a.5.5 0 0 1-.5-.5V2.2zM10 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H6z" />
  </svg>
);

/** Fluent `document_add_16_filled`. */
export const FluentRefDocumentAddFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1v3.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5H8.66A5.5 5.5 0 0 0 4 5.2V2.5C4 1.67 4.67 1 5.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zm0 9.25a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H6z" />
  </svg>
);

/** Fluent `arrow_shuffle_16_regular`. */
export const FluentRefShuffleIcon = () => (
  <svg {...base}>
    <path d="M12.35 3.65a.5.5 0 0 0-.7.7l.65.65c-2.33.08-3.78 1.4-5.1 2.6l-.04.03C5.78 8.89 4.53 10 2.5 10a.5.5 0 0 0 0 1c2.44 0 3.95-1.37 5.3-2.6l.04-.03c1.33-1.22 2.54-2.3 4.45-2.37l-.64.65a.5.5 0 0 0 .7.7l1.5-1.5a.5.5 0 0 0 0-.7zM2.5 5c1.83 0 3.13.77 4.24 1.67l-.25.22-.5.46A5.4 5.4 0 0 0 2.5 6a.5.5 0 0 1 0-1m9.8 6a6.5 6.5 0 0 1-4.04-1.67l.25-.22.5-.46A5.4 5.4 0 0 0 12.3 10l-.64-.65a.5.5 0 0 1 .7-.7l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 0 1-.7-.7z" />
  </svg>
);

/** Fluent `arrow_shuffle_16_filled`. */
export const FluentRefShuffleFilledIcon = () => (
  <svg {...base}>
    <path d="M12.28 3.47a.75.75 0 1 0-1.06 1.06l.26.27c-2.09.25-3.37 1.52-4.47 2.63l-.04.04C5.71 8.73 4.66 9.75 2.75 9.75a.75.75 0 0 0 0 1.5c2.56 0 4-1.45 5.24-2.68l.04-.04c1.05-1.05 1.95-1.93 3.33-2.2l-.14.14a.75.75 0 0 0 1.06 1.06l1.5-1.5c.3-.3.3-.77 0-1.06zM2.75 4.75a6 6 0 0 1 4 1.52l-.4.4-.09.1-.58.56a4.4 4.4 0 0 0-2.93-1.08.75.75 0 0 1 0-1.5m8.73 6.45a6 6 0 0 1-3.24-1.47l.41-.4.09-.1.58-.56c.6.48 1.24.84 2.04 1l-.14-.14a.75.75 0 0 1 1.06-1.06l1.5 1.5c.3.3.3.77 0 1.06l-1.5 1.5a.75.75 0 1 1-1.06-1.06z" />
  </svg>
);

/** Fluent `fingerprint_16_regular`. */
export const FluentRefFingerprintIcon = () => (
  <svg {...base}>
    <path d="M8 7a3 3 0 0 1 3 3q0 1.85 1.34 3.14a.5.5 0 0 1-.68.72A5.2 5.2 0 0 1 10 10a2 2 0 1 0-4 0c0 .6.22 1.41.57 2.22.36.8.82 1.51 1.26 1.9a.5.5 0 1 1-.66.75 7 7 0 0 1-1.51-2.25A7 7 0 0 1 5 10a3 3 0 0 1 3-3m.08 2.26c.27.04.46.3.42.57A4.6 4.6 0 0 0 9 12.1c.38.86.9 1.64 1.34 2.04a.5.5 0 0 1-.67.74 7 7 0 0 1-1.6-2.38 5.5 5.5 0 0 1-.56-2.81.5.5 0 0 1 .57-.42M8 5a5 5 0 0 1 4.16 2.22.5.5 0 0 1-.83.56A4 4 0 0 0 4 10c0 1.17.24 1.98.46 2.48q.16.37.3.54.06.1.16.2a.5.5 0 0 1-.7.7q-.16-.14-.29-.33-.17-.25-.39-.7A7 7 0 0 1 3 10a5 5 0 0 1 5-5M6.38 3.19a.5.5 0 0 1 .24.97A6 6 0 0 0 2 10q0 .72.16 1.39a.5.5 0 1 1-.97.23 7 7 0 0 1 5.2-8.43M12.46 9c.28 0 .5.22.51.5 0 .19.05.53.18.85q.2.5.57.7a.5.5 0 0 1-.44.9 2.3 2.3 0 0 1-1.05-1.23 4 4 0 0 1-.26-1.21c0-.28.22-.5.5-.51M8.54 3.02c3.43.26 6.2 3 6.46 6.44a.5.5 0 0 1-1 .08 6 6 0 0 0-5.54-5.52.5.5 0 0 1 .08-1m-6.38.2a.5.5 0 1 1 .68.73q-.42.39-.76.85a.5.5 0 0 1-.8-.6q.39-.53.88-.98M8 1c1.78 0 3.44.51 4.77 1.38a.5.5 0 1 1-.54.84A7.8 7.8 0 0 0 8 2a8 8 0 0 0-3.3.7.5.5 0 0 1-.4-.9A9 9 0 0 1 8 1" />
  </svg>
);

/** Fluent `fingerprint_16_filled`. */
export const FluentRefFingerprintFilledIcon = () => (
  <svg {...base}>
    <path d="M8 8.5a2 2 0 0 1 2 2c0 .73.22 1.55.83 2.27a.75.75 0 0 1-1.16.96A5 5 0 0 1 8.5 10.5a.5.5 0 0 0-1 0c0 .85.31 1.66.66 2.28a7 7 0 0 0 .65.97.75.75 0 0 1-1.07 1.05l-.14-.15a7 7 0 0 1-.76-1.14c-.4-.74-.84-1.8-.84-3.01 0-1.1.9-2 2-2M8 6c1.47 0 2.78.7 3.6 1.8a.75.75 0 1 1-1.2.9A3 3 0 0 0 5 10.5c0 .94.17 1.53.31 1.85q.09.23.25.4A.75.75 0 0 1 4.5 13.8l-.22-.25q-.15-.21-.34-.6a6 6 0 0 1-.44-2.46A4.5 4.5 0 0 1 8 6M6.04 3.78a.75.75 0 0 1 .42 1.44 5.5 5.5 0 0 0-3.74 6.82.75.75 0 0 1-1.44.41 7 7 0 0 1 4.76-8.67m5.7 5.97c.42 0 .75.34.75.75q.01.29.16.52c.08.14.13.2.2.27a.75.75 0 0 1-1.09 1.03l-.18-.2q-.1-.13-.24-.35A2.6 2.6 0 0 1 11 10.5c0-.41.34-.75.75-.75m-2.9-6.2A7 7 0 0 1 15 10.23a.75.75 0 0 1-1.5.05 5.5 5.5 0 0 0-4.84-5.24.75.75 0 0 1 .17-1.5M2.16 3.2A.75.75 0 0 1 3.2 4.3q-.47.45-.82.95a.75.75 0 0 1-1.24-.84q.45-.66 1.04-1.2M8 1c1.72 0 3.33.48 4.64 1.3a.75.75 0 0 1-.79 1.27 7.43 7.43 0 0 0-6.8-.47.75.75 0 0 1-.6-1.38A9 9 0 0 1 8 1" />
  </svg>
);

/** Fluent `gauge_16_regular`. */
export const FluentRefGaugeIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2m0 1q.28 0 .55.03a.5.5 0 0 1-.1 1L8 4a4 4 0 0 0-2.51 7.11.5.5 0 0 1-.63.78A5 5 0 0 1 8 3m4.42 4a.5.5 0 0 1 .55.45 5 5 0 0 1-1.83 4.44.5.5 0 0 1-.63-.78 4 4 0 0 0 1.47-3.56.5.5 0 0 1 .44-.55m-2.2-2.07c.28-.19.58-.5.91-.41a.5.5 0 0 1 .36.35c.08.34-.23.63-.42.92-.57.85-1.81 2.72-2.19 3.1A1.25 1.25 0 0 1 7.12 7.1c.37-.37 2.23-1.61 3.1-2.18" />
  </svg>
);

/** Fluent `gauge_16_filled`. */
export const FluentRefGaugeFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 2a5 5 0 0 0-3.14 8.89.5.5 0 0 0 .63-.78 4 4 0 0 1 2.96-7.09.5.5 0 0 0 .1-.99zm4.42 4a.5.5 0 0 0-.44.55L12 8a4 4 0 0 1-1.49 3.11.5.5 0 0 0 .63.78 5 5 0 0 0 1.83-4.44.5.5 0 0 0-.55-.45m-1.29-2.48c-.33-.1-.63.22-.92.41-.86.57-2.72 1.81-3.1 2.18a1.25 1.25 0 0 0 1.77 1.77c.38-.37 1.62-2.24 2.19-3.1.2-.28.5-.57.42-.9a.5.5 0 0 0-.36-.36" />
  </svg>
);

/** Fluent `chat_add_16_regular`. */
export const FluentRefChatAddIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 1a6 6 0 0 0-5.07 9.2q.12.2.05.43l-.69 2.08 2.08-.7q.23-.06.42.06A6 6 0 1 0 8 2m0 2.5c.28 0 .5.22.5.5v2.5H11a.5.5 0 0 1 0 1H8.5V11a.5.5 0 1 1-1 0V8.5H5a.5.5 0 0 1 0-1h2.5V5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `chat_add_16_filled`. */
export const FluentRefChatAddFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 3.5a.5.5 0 0 0-.5.5v2.5H5a.5.5 0 0 0 0 1h2.5V11a.5.5 0 0 0 1 0V8.5H11a.5.5 0 1 0 0-1H8.5V5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `cloud_off_16_regular`. */
export const FluentRefCloudOffIcon = () => (
  <svg {...base}>
    <path d="m12.25 12.96 1.9 1.9a.5.5 0 0 0 .7-.71l-13-13a.5.5 0 1 0-.7.7l3.3 3.3q-.33.63-.42 1.36A3.25 3.25 0 0 0 4.25 13h7.5q.26 0 .5-.04M11.3 12H4.25a2.25 2.25 0 0 1 0-4.5h.25A.5.5 0 0 0 5 7a3 3 0 0 1 .2-1.09zM14 9.75c0 .6-.23 1.13-.6 1.53l.7.7a3.24 3.24 0 0 0-2.13-5.47 4 4 0 0 0-6.18-2.84l.72.72Q7.18 4.01 8 4a3 3 0 0 1 3 3c0 .28.22.5.5.5h.25c1.24 0 2.25 1 2.25 2.25" />
  </svg>
);

/** Fluent `cloud_off_16_filled`. */
export const FluentRefCloudOffFilledIcon = () => (
  <svg {...base}>
    <path d="m12.25 12.96 1.9 1.9a.5.5 0 0 0 .7-.71l-13-13a.5.5 0 1 0-.7.7l3.3 3.3q-.33.63-.42 1.36A3.25 3.25 0 0 0 4.25 13h7.5q.26 0 .5-.04M15 9.75c0 .87-.34 1.65-.9 2.24L5.8 3.67a4 4 0 0 1 6.18 2.84A3.25 3.25 0 0 1 15 9.75" />
  </svg>
);

/** Fluent `folder_open_16_regular`. */
export const FluentRefFolderOpenIcon = () => (
  <svg {...base}>
    <path d="M2 4.5v4.6l.92-1.6A3 3 0 0 1 5.52 6h6.4c-.21-.58-.77-1-1.42-1H7a.5.5 0 0 1-.35-.15l-1.71-1.7A.5.5 0 0 0 4.59 3H3.5C2.67 3 2 3.67 2 4.5M7.07 14H3.5A2.5 2.5 0 0 1 1 11.5v-7A2.5 2.5 0 0 1 3.5 2h1.09c.4 0 .78.16 1.06.44L7.2 4h3.29a2.5 2.5 0 0 1 2.46 2.04 2.5 2.5 0 0 1 1.7 3.71l-1.58 2.75a3 3 0 0 1-2.6 1.5zM5.52 7A2 2 0 0 0 3.8 8L2.2 10.75A1.5 1.5 0 0 0 3.5 13h6.98a2 2 0 0 0 1.73-1l1.59-2.75A1.5 1.5 0 0 0 12.5 7z" />
  </svg>
);

/** Fluent `folder_open_16_filled`. */
export const FluentRefFolderOpenFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5v4.97l1-1.72A3.5 3.5 0 0 1 5.01 6h7.93a2.5 2.5 0 0 0-2.45-2H7.2L5.66 2.44A1.5 1.5 0 0 0 4.59 2H3.5A2.5 2.5 0 0 0 1 4.5M5.02 7H13a2 2 0 0 1 1.73 3l-1.59 2.75A2.5 2.5 0 0 1 10.98 14H3a2 2 0 0 1-1.73-3l1.59-2.75A2.5 2.5 0 0 1 5.02 7" />
  </svg>
);

/** Fluent `mail_read_16_regular`. */
export const FluentRefMailOpenIcon = () => (
  <svg {...base}>
    <path d="M8.24 1.56a.5.5 0 0 0-.48 0L1.8 4.78A1.5 1.5 0 0 0 1 6.1V12c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V6.1c0-.55-.3-1.06-.79-1.32zm-5.98 4.1L8 2.56l5.74 3.1.15.13L8 8.93 2.1 5.8a1 1 0 0 1 .16-.13M2 6.86l5.76 3.08a.5.5 0 0 0 .48 0L14 6.87V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `mail_read_16_filled`. */
export const FluentRefMailOpenFilledIcon = () => (
  <svg {...base}>
    <path d="M7.73 1.08a.5.5 0 0 1 .54 0l4.8 3.06a2 2 0 0 1 .85 1.11L8 8.43 2.09 5.24a2 2 0 0 1 .84-1.1zM2 6.33V11c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6.34l-5.76 3.1a.5.5 0 0 1-.48 0z" />
  </svg>
);

/** Fluent `timer_16_regular`. */
export const FluentRefTimerIcon = () => (
  <svg {...base}>
    <path d="M5 1.5c0-.28.22-.5.5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M7.5 5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 1 0v-4a.5.5 0 0 0-.5-.5m6 4a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-1 0a5 5 0 1 0-10 0 5 5 0 0 0 10 0m-.05-6.36a.5.5 0 1 0-.7.7l1.4 1.41a.5.5 0 1 0 .7-.7z" />
  </svg>
);

/** Fluent `timer_16_filled`. */
export const FluentRefTimerFilledIcon = () => (
  <svg {...base}>
    <path d="M5 1.5c0-.28.22-.5.5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M7.5 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12m0-10c.28 0 .5.22.5.5v4a.5.5 0 0 1-1 0v-4c0-.28.22-.5.5-.5m4.95-2.36a.5.5 0 1 0-.7.7l1.4 1.41a.5.5 0 1 0 .7-.7z" />
  </svg>
);

/** Fluent `laptop_16_regular`. */
export const FluentRefLaptopIcon = () => (
  <svg {...base}>
    <path d="M4.5 4C3.67 4 3 4.67 3 5.5v4c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5zM4 5.5c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM2.5 12a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `laptop_16_filled`. */
export const FluentRefLaptopFilledIcon = () => (
  <svg {...base}>
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4h7c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 9.5zM2.5 12a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `tablet_16_regular`. */
export const FluentRefTabletIcon = () => (
  <svg {...base}>
    <path d="M6.5 10a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM2.75 3C1.78 3 1 3.78 1 4.75v6.5c0 .97.78 1.75 1.75 1.75h10.5c.97 0 1.75-.78 1.75-1.75v-6.5C15 3.78 14.22 3 13.25 3zM2 4.75c0-.41.34-.75.75-.75h10.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75H2.75a.75.75 0 0 1-.75-.75z" />
  </svg>
);

/** Fluent `tablet_16_filled`. */
export const FluentRefTabletFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.75C1 3.78 1.78 3 2.75 3h10.5c.97 0 1.75.78 1.75 1.75v6.5c0 .97-.78 1.75-1.75 1.75H2.75C1.78 13 1 12.22 1 11.25zM6.5 10a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `tv_16_regular`. */
export const FluentRefTvIcon = () => (
  <svg {...base}>
    <path d="M4 3a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM3 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm1.5 7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `tv_16_filled`. */
export const FluentRefTvFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 9.5c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `smartwatch_20_regular`. */
export const FluentRefWatchIcon = () => (
  <svg {...base}>
    <path d="M6 5.27V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v1.27c.6.34 1 .99 1 1.73v1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v2a2 2 0 0 1-1 1.73V16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1.27A2 2 0 0 1 5 13V7a2 2 0 0 1 1-1.73M8 3a1 1 0 0 0-1 1v1h6V4a1 1 0 0 0-1-1zm6 10V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1m-7 3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H7z" />
  </svg>
);

/** Fluent `smartwatch_20_filled`. */
export const FluentRefWatchFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a2 2 0 0 0-2 2v.17A3 3 0 0 1 7 4h6a3 3 0 0 1 1 .17V4a2 2 0 0 0-2-2zM7 5a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2v-2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1V7a2 2 0 0 0-2-2zm0 11a3 3 0 0 1-1-.17V16c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2v-.17a3 3 0 0 1-1 .17z" />
  </svg>
);

/** Fluent `speaker_box_16_regular`. */
export const FluentRefSpeakerIcon = () => (
  <svg {...base}>
    <path d="M3 3.5A2.5 2.5 0 0 1 5.5 1h5A2.5 2.5 0 0 1 13 3.5v9a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 12.5zM5.5 2C4.67 2 4 2.67 4 3.5v9c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5zM8 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M5.5 10a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0M8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `speaker_box_16_filled`. */
export const FluentRefSpeakerFilledIcon = () => (
  <svg {...base}>
    <path d="M3 3.5A2.5 2.5 0 0 1 5.5 1h5A2.5 2.5 0 0 1 13 3.5v9a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 12.5zM9 5a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-2.5 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M8 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5" />
  </svg>
);

/** Fluent `hard_drive_16_regular`. */
export const FluentRefHardDriveIcon = () => (
  <svg {...base}>
    <path d="M13.85 7.85 11.9 3.73v-.01A1.2 1.2 0 0 0 10.75 3h-5.5a1.2 1.2 0 0 0-1.13.72L2.15 7.86Q2 8.16 2 8.5v2A1.5 1.5 0 0 0 3.5 12h9a1.5 1.5 0 0 0 1.5-1.5v-2q0-.33-.15-.65M5.25 4h5.5a.24.24 0 0 1 .23.14L12.34 7H3.66l1.36-2.86A.24.24 0 0 1 5.25 4M13 10.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5zm-1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
  </svg>
);

/** Fluent `hard_drive_16_filled`. */
export const FluentRefHardDriveFilledIcon = () => (
  <svg {...base}>
    <path d="M12.5 8c.83 0 1.5.67 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 10.5v-1C2 8.67 2.67 8 3.5 8zm1.06-.77-1.68-3.5v-.01A1.2 1.2 0 0 0 10.76 3h-5.5a1.2 1.2 0 0 0-1.13.72L2.44 7.24A2.5 2.5 0 0 1 3.5 7h9q.57 0 1.06.23M12 10.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
  </svg>
);

/** Fluent `developer_board_16_regular`. */
export const FluentRefChipIcon = () => (
  <svg {...base}>
    <path d="M14.5 8.5a.5.5 0 1 0 0-1H13V6h1.5a.5.5 0 1 0 0-1H13a2 2 0 0 0-2-2V1.5a.5.5 0 1 0-1 0V3H8.5V1.5a.5.5 0 1 0-1 0V3H6V1.5a.5.5 0 1 0-1 0V3a2 2 0 0 0-2 2H1.5a.5.5 0 1 0 0 1H3v1.5H1.5a.5.5 0 1 0 0 1H3V10H1.5a.5.5 0 1 0 0 1H3a2 2 0 0 0 2 2v1.5q0 .2.15.35A.5.5 0 0 0 6 14.5V13h1.5v1.5q0 .2.15.35a.5.5 0 0 0 .85-.35V13H10v1.5q0 .2.15.35a.5.5 0 0 0 .85-.35V13a2 2 0 0 0 2-2h1.5a.5.5 0 1 0 0-1H13V8.5zM12 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-4-.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
  </svg>
);

/** Fluent `developer_board_16_filled`. */
export const FluentRefChipFilledIcon = () => (
  <svg {...base}>
    <path d="M14.5 8.5a.5.5 0 1 0 0-1H13V6h1.5a.5.5 0 1 0 0-1H13a2 2 0 0 0-2-2V1.5a.5.5 0 1 0-1 0V3H8.5V1.5a.5.5 0 1 0-1 0V3H6V1.5a.5.5 0 1 0-1 0V3a2 2 0 0 0-2 2H1.5a.5.5 0 1 0 0 1H3v1.5H1.5a.5.5 0 1 0 0 1H3V10H1.5a.5.5 0 1 0 0 1H3a2 2 0 0 0 2 2v1.5q0 .2.15.35A.5.5 0 0 0 6 14.5V13h1.5v1.5q0 .2.15.35a.5.5 0 0 0 .85-.35V13H10v1.5q0 .2.15.35a.5.5 0 0 0 .85-.35V13a2 2 0 0 0 2-2h1.5a.5.5 0 1 0 0-1H13V8.5zm-6.5 2a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
  </svg>
);

/** Fluent `calendar_checkmark_16_regular`. */
export const FluentRefCalendarCheckIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m4.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `calendar_checkmark_16_filled`. */
export const FluentRefCalendarCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm2 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `document_checkmark_16_regular`. */
export const FluentRefDocumentCheckIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.2q.49-.13 1-.18V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1H9.74q-.47.58-1.08 1H12a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06l-2.91-2.91A1.5 1.5 0 0 0 9.59 1zm6.8 4h-2.3a.5.5 0 0 1-.5-.5V2.2zM10 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M7.85 8.65a.5.5 0 0 0-.7 0L4.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `document_checkmark_16_filled`. */
export const FluentRefDocumentCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1v3.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5H8.66A5.5 5.5 0 0 0 4 5.2V2.5C4 1.67 4.67 1 5.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zm0 9.25a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M7.85 8.65a.5.5 0 0 0-.7 0L4.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `person_available_16_regular`. */
export const FluentRefPersonCheckIcon = () => (
  <svg {...base}>
    <path d="M4 4.5a2.5 2.5 0 1 1 4.89.74 5.5 5.5 0 0 0-2.62 1.75A2.5 2.5 0 0 1 4 4.5M6.5 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m4 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m2.35-6.35c.2.2.2.5 0 .7l-3 3a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 2.65-2.64c.2-.2.5-.2.7 0M5.6 8H3.5C2.67 8 2 8.95 2 9.75V10c0 1.73 1.55 3.64 4.22 3.95a6 6 0 0 1-.72-1.16C3.82 12.3 3 10.98 3 10v-.25c0-.14.07-.36.22-.55.15-.18.26-.2.28-.2h1.7q.16-.52.4-1" />
  </svg>
);

/** Fluent `person_available_16_filled`. */
export const FluentRefPersonCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M8.89 5.24a5.5 5.5 0 0 0-2.62 1.75 2.5 2.5 0 1 1 2.62-1.75M3.5 8h2.1a5.5 5.5 0 0 0 .62 5.95C3.55 13.64 2 11.73 2 10v-.25C2 8.95 2.67 8 3.5 8M15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `shield_checkmark_16_regular`. */
export const FluentRefShieldCheckIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-.48-.24-1-.4v-.22a6.6 6.6 0 0 1-4-1.8 6.7 6.7 0 0 1-4 1.8V7.5q.02 2.13 1.02 3.44.08 1 .48 1.86Q3 10.98 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `shield_checkmark_16_filled`. */
export const FluentRefShieldCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-1.14-.58-2.5-.6a5.5 5.5 0 0 0-5 7.8Q3 10.98 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M15 10.5a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0m-2.15-1.85c.2.2.2.5 0 .7l-3 3a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 2.65-2.64c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `data_bar_vertical_16_regular`. */
export const FluentRefBarChartIcon = () => (
  <svg {...base}>
    <path d="M2 3.5a1.5 1.5 0 1 1 3 0v9a1.5 1.5 0 0 1-3 0zM3.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5M6 6.5a1.5 1.5 0 1 1 3 0v6a1.5 1.5 0 0 1-3 0zM7.5 6a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0v-6a.5.5 0 0 0-.5-.5m4 2c-.83 0-1.5.67-1.5 1.5v3a1.5 1.5 0 0 0 3 0v-3c0-.83-.67-1.5-1.5-1.5M11 9.5a.5.5 0 0 1 1 0v3a.5.5 0 0 1-1 0z" />
  </svg>
);

/** Fluent `data_bar_vertical_16_filled`. */
export const FluentRefBarChartFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v9a1.5 1.5 0 0 0 3 0v-9C5 2.67 4.33 2 3.5 2m4 3C6.67 5 6 5.67 6 6.5v6a1.5 1.5 0 0 0 3 0v-6C9 5.67 8.33 5 7.5 5m4 3c-.83 0-1.5.67-1.5 1.5v3a1.5 1.5 0 0 0 3 0v-3c0-.83-.67-1.5-1.5-1.5" />
  </svg>
);

/** Fluent `data_pie_16_regular`. */
export const FluentRefPieChartIcon = () => (
  <svg {...base}>
    <path d="M8.5 1a.5.5 0 0 0-.5.5v6c0 .28.22.5.5.5h6a.5.5 0 0 0 .5-.5A6.5 6.5 0 0 0 8.5 1M9 7V2.02A5.5 5.5 0 0 1 13.98 7zM7 3.52a.5.5 0 0 0-.54-.5 6 6 0 1 0 6.52 6.52.5.5 0 0 0-.5-.54H7zM2 9a5 5 0 0 1 4-4.9v5.4c0 .28.22.5.5.5h5.4A5 5 0 0 1 2 9" />
  </svg>
);

/** Fluent `data_pie_16_filled`. */
export const FluentRefPieChartFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1.5c0-.28.22-.5.5-.5A6.5 6.5 0 0 1 15 7.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5zM7 3.52a.5.5 0 0 0-.54-.5 6 6 0 1 0 6.52 6.52.5.5 0 0 0-.5-.54H7z" />
  </svg>
);

/** Fluent `add_circle_16_regular`. */
export const FluentRefAddCircleIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1m.5 4a.5.5 0 0 0-1 0v2.5H5a.5.5 0 0 0 0 1h2.5V11a.5.5 0 0 0 1 0V8.5H11a.5.5 0 0 0 0-1H8.5z" />
  </svg>
);

/** Fluent `add_circle_16_filled`. */
export const FluentRefAddCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m7.5-3a.5.5 0 0 0-1 0v2.5H5a.5.5 0 0 0 0 1h2.5V11a.5.5 0 0 0 1 0V8.5H11a.5.5 0 0 0 0-1H8.5z" />
  </svg>
);

/** Fluent `subtract_circle_16_regular`. */
export const FluentRefRemoveCircleIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1M5 7.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `subtract_circle_16_filled`. */
export const FluentRefRemoveCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m4-.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `prohibited_16_regular`. */
export const FluentRefProhibitedIcon = () => (
  <svg {...base}>
    <path d="M11.87 3.42a6 6 0 0 0-8.45 8.45zm.71.7-8.45 8.46a6 6 0 0 0 8.45-8.45M3.05 3.06a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9" />
  </svg>
);

/** Fluent `prohibited_16_filled`. */
export const FluentRefProhibitedFilledIcon = () => (
  <svg {...base}>
    <path d="M11.32 3.62a5.5 5.5 0 0 0-7.7 7.7zm1.06 1.06-7.7 7.7a5.5 5.5 0 0 0 7.7-7.7M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9" />
  </svg>
);

/** Fluent `chevron_up_down_16_regular`. */
export const FluentRefChevronsUpDownIcon = () => (
  <svg {...base}>
    <path d="M4.15 6.35c.2.2.5.2.7 0L8 3.21l3.15 3.14a.5.5 0 0 0 .7-.7l-3.5-3.5a.5.5 0 0 0-.7 0l-3.5 3.5a.5.5 0 0 0 0 .7m0 3.3c.2-.2.5-.2.7 0L8 12.79l3.15-3.14a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `chevron_up_down_16_filled`. */
export const FluentRefChevronsUpDownFilledIcon = () => (
  <svg {...base}>
    <path d="M4.22 6.53c.3.3.77.3 1.06 0L8 3.81l2.72 2.72a.75.75 0 1 0 1.06-1.06L8.53 2.22a.75.75 0 0 0-1.06 0L4.22 5.47c-.3.3-.3.77 0 1.06m0 2.94c.3-.3.77-.3 1.06 0L8 12.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25c-.3.3-.77.3-1.06 0l-3.25-3.25a.75.75 0 0 1 0-1.06" />
  </svg>
);

/** Fluent `arrow_minimize_16_regular`. */
export const FluentRefCollapseIcon = () => (
  <svg {...base}>
    <path d="M13.85 2.85a.5.5 0 0 0-.7-.7L10 5.29V3.5a.5.5 0 0 0-1 0v2.9c0 .33.27.6.6.6h2.9a.5.5 0 0 0 0-1h-1.8zM6.5 13a.5.5 0 0 1-.5-.5v-1.8l-3.15 3.15a.5.5 0 0 1-.7-.7L5.29 10H3.5a.5.5 0 0 1 0-1h2.9c.33 0 .6.27.6.6v2.9a.5.5 0 0 1-.5.5" />
  </svg>
);

/** Fluent `arrow_minimize_16_filled`. */
export const FluentRefCollapseFilledIcon = () => (
  <svg {...base}>
    <path d="M13.78 3.28a.75.75 0 0 0-1.06-1.06L10.5 4.44V3.25a.75.75 0 0 0-1.5 0V6.2a.75.75 0 0 0 .8.8h2.95a.75.75 0 0 0 0-1.5h-1.19zM6.25 13.5a.75.75 0 0 1-.75-.75v-1.19l-2.22 2.22a.75.75 0 0 1-1.06-1.06l2.22-2.22H3.25a.75.75 0 0 1 0-1.5H6.2a.75.75 0 0 1 .8.8v2.95c0 .41-.34.75-.75.75" />
  </svg>
);

/** Fluent `clock_alarm_16_regular`. */
export const FluentRefAlarmIcon = () => (
  <svg {...base}>
    <path d="M8 6a.5.5 0 1 0-1 0v3c0 .28.22.5.5.5h2a.5.5 0 1 0 0-1H8zM2 4.5a2.5 2.5 0 0 1 4.62-1.33 5.5 5.5 0 0 1 2.76 0 2.5 2.5 0 1 1 3.72 3.25 5.5 5.5 0 0 1-.87 5.6l1.12 1.13a.5.5 0 0 1-.7.7l-1.13-1.12a5.5 5.5 0 0 1-7.04 0l-1.13 1.12a.5.5 0 1 1-.7-.7l1.12-1.13a5.5 5.5 0 0 1-.87-5.6A2.5 2.5 0 0 1 2 4.5M4.5 3a1.5 1.5 0 0 0-1.11 2.5 5.5 5.5 0 0 1 2.25-1.97A1.5 1.5 0 0 0 4.5 3m5.86.53c.92.44 1.7 1.12 2.25 1.97q.37-.4.39-1a1.5 1.5 0 0 0-2.64-.97M8 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9" />
  </svg>
);

/** Fluent `clock_alarm_16_filled`. */
export const FluentRefAlarmFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5a2.5 2.5 0 0 1 4.62-1.33 5.5 5.5 0 0 1 2.76 0 2.5 2.5 0 1 1 3.72 3.25 5.5 5.5 0 0 1-.87 5.6l1.12 1.13a.5.5 0 0 1-.7.7l-1.13-1.12a5.5 5.5 0 0 1-7.04 0l-1.13 1.12a.5.5 0 1 1-.7-.7l1.12-1.13a5.5 5.5 0 0 1-.87-5.6A2.5 2.5 0 0 1 2 4.5m3.64-.97A1.5 1.5 0 1 0 3.4 5.5a5.5 5.5 0 0 1 2.25-1.97m6.97 1.97q.37-.4.39-1a1.5 1.5 0 0 0-2.64-.97c.92.44 1.7 1.12 2.25 1.97m-5.11 0A.5.5 0 0 0 7 6v3c0 .28.22.5.5.5h2a.5.5 0 0 0 0-1H8V6a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `branch_16_regular`. */
export const FluentRefGitBranchIcon = () => (
  <svg {...base}>
    <path d="M11.5 6a2.5 2.5 0 0 0-2.45 1.98c-1.88-.12-3.58-1.02-3.97-2.05A2.5 2.5 0 1 0 4 5.95v4.1a2.5 2.5 0 1 0 1 0V7.47a7 7 0 0 0 4.05 1.52A2.5 2.5 0 1 0 11.5 6M3 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m3 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5.5-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
  </svg>
);

/** Fluent `branch_16_filled`. */
export const FluentRefGitBranchFilledIcon = () => (
  <svg {...base}>
    <path d="M13.75 7.43a2.5 2.5 0 0 0-4.7.56c-1.89-.13-3.6-1.03-3.98-2.06A2.5 2.5 0 1 0 4 5.95v4.1a2.5 2.5 0 1 0 1 0V7.47a7 7 0 0 0 4.05 1.52 2.5 2.5 0 0 0 4.93-.18 2.5 2.5 0 0 0-.22-1.38" />
  </svg>
);

/** Fluent `re_order_dots_vertical_16_regular`. */
export const FluentRefGripVerticalIcon = () => (
  <svg {...base}>
    <path d="M6 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `re_order_dots_vertical_16_filled`. */
export const FluentRefGripVerticalFilledIcon = () => (
  <svg {...base}>
    <path d="M5.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m1.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M10.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M12 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

/** Fluent `pulse_20_regular`. */
export const FluentRefActivityIcon = () => (
  <svg {...base}>
    <path d="M7 3a.5.5 0 0 1 .48.37l3.05 11.3 2.5-8.31a.5.5 0 0 1 .94-.04L15.35 10h2.15a.5.5 0 0 1 0 1H15a.5.5 0 0 1-.47-.32l-.98-2.62-2.57 8.58a.5.5 0 0 1-.96-.01L6.99 5.37l-1.5 5.27A.5.5 0 0 1 5 11H2.5a.5.5 0 0 1 0-1h2.12l1.9-6.64A.5.5 0 0 1 7 3" />
  </svg>
);

/** Fluent `pulse_20_filled`. */
export const FluentRefActivityFilledIcon = () => (
  <svg {...base}>
    <path d="M7.01 3c.33 0 .62.23.71.55l2.82 10.07 2.24-7.1a.75.75 0 0 1 1.4-.07L15.5 9.5h1.76a.75.75 0 0 1 0 1.5H15a.8.8 0 0 1-.69-.45l-.7-1.65-2.4 7.58a.75.75 0 0 1-1.43-.03L6.97 6.41l-1.25 4.06A.75.75 0 0 1 5 11H2.75a.75.75 0 0 1 0-1.5h1.7l1.83-5.97c.1-.32.4-.53.73-.53" />
  </svg>
);

/** Fluent `layout_row_two_split_top_16_regular`. */
export const FluentRefLayoutIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v3h4.5V3zm4 4.5H13v-3c0-.83-.67-1.5-1.5-1.5h-3zm4.5 1H3v3c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5z" />
  </svg>
);

/** Fluent `layout_row_two_split_top_16_filled`. */
export const FluentRefLayoutFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 7.5V2h-3A2.5 2.5 0 0 0 2 4.5v3zm1 0H14v-3A2.5 2.5 0 0 0 11.5 2h-3zm5.5 1H2v3A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5z" />
  </svg>
);

/** Fluent `call_16_regular`. */
export const FluentRefCallIcon = () => (
  <svg {...base}>
    <path d="M3.71 5.26c-.19-1.26.7-2.39 2.06-2.8a1 1 0 0 1 1.2.6l.44 1.15a1 1 0 0 1-.26 1.1L5.86 6.48a.5.5 0 0 0-.15.47l.01.05.16.58a7 7 0 0 0 1.8 2.89l.1.1.04.03a.5.5 0 0 0 .48.1l1.67-.53a1 1 0 0 1 1.07.32l.8.96c.33.4.29 1-.1 1.34-1.03.97-2.46 1.17-3.45.37a12.7 12.7 0 0 1-4.58-7.91m3.05 1.76 1.07-.98a2 2 0 0 0 .52-2.18L7.92 2.7a2 2 0 0 0-2.45-1.2C3.8 2 2.44 3.52 2.72 5.4a13.73 13.73 0 0 0 4.94 8.54c1.5 1.2 3.48.8 4.77-.4.76-.72.84-1.9.18-2.71l-.8-.96a2 2 0 0 0-2.14-.64l-1.39.44a7 7 0 0 1-.93-1.23 6 6 0 0 1-.6-1.42" />
  </svg>
);

/** Fluent `call_16_filled`. */
export const FluentRefCallFilledIcon = () => (
  <svg {...base}>
    <path d="m6.76 7.02 1.07-.98a2 2 0 0 0 .52-2.18l-.46-1.22a1.9 1.9 0 0 0-2.35-1.16C3.82 2.01 2.5 3.6 2.9 5.5a15.9 15.9 0 0 0 4.77 8.24c1.44 1.31 3.49.98 4.8-.25.74-.68.81-1.82.18-2.6l-.84-1.01a2 2 0 0 0-2.15-.64l-1.39.44a7 7 0 0 1-.93-1.22 6 6 0 0 1-.6-1.43" />
  </svg>
);

/** Fluent `arrow_reply_16_regular`. */
export const FluentRefReplyIcon = () => (
  <svg {...base}>
    <path d="M6.35 3.65c.2.2.2.5 0 .7L3.71 7H8.5a5.5 5.5 0 0 1 5.5 5.5.5.5 0 0 1-1 0A4.5 4.5 0 0 0 8.5 8H3.7l2.65 2.65a.5.5 0 0 1-.7.7l-3.5-3.5a.5.5 0 0 1 0-.7l3.5-3.5c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `arrow_reply_16_filled`. */
export const FluentRefReplyFilledIcon = () => (
  <svg {...base}>
    <path d="M6.78 4.28a.75.75 0 0 0-1.06-1.06l-3.5 3.5c-.3.3-.3.77 0 1.06l3.5 3.5a.75.75 0 0 0 1.06-1.06L4.56 8h3.69c2.35 0 4.25 1.9 4.25 4.25a.75.75 0 0 0 1.5 0A5.75 5.75 0 0 0 8.25 6.5H4.56z" />
  </svg>
);

/** Fluent `arrow_sync_16_regular`. */
export const FluentRefSyncIcon = () => (
  <svg {...base}>
    <path d="M7.15.65c.2-.2.5-.2.7 0l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 1 1-.7-.7L7.79 3a5 5 0 0 0-2.94 8.88.5.5 0 1 1-.63.78A5.99 5.99 0 0 1 7.8 2l-.65-.65a.5.5 0 0 1 0-.7m3.92 2.76a.5.5 0 0 1 .7-.07A5.99 5.99 0 0 1 8.2 14l.65.65a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 0 1 .7.7l-.64.65a5 5 0 0 0 2.94-8.88.5.5 0 0 1-.08-.7" />
  </svg>
);

/** Fluent `arrow_sync_16_filled`. */
export const FluentRefSyncFilledIcon = () => (
  <svg {...base}>
    <path d="M6.97.47c.3-.3.77-.3 1.06 0l1.75 1.75c.3.3.3.77 0 1.06L8.03 5.03a.75.75 0 0 1-1.06-1.06l.43-.43a4.5 4.5 0 0 0-2.28 7.92.75.75 0 0 1-.96 1.15 5.99 5.99 0 0 1 3.3-10.59l-.49-.49a.75.75 0 0 1 0-1.06m3.81 3.02a.75.75 0 0 1 1.06-.1 5.99 5.99 0 0 1-3.3 10.59l.49.49a.75.75 0 1 1-1.06 1.06l-1.75-1.75a.75.75 0 0 1 0-1.06l1.75-1.75a.75.75 0 0 1 1.06 1.06l-.43.43a4.5 4.5 0 0 0 2.28-7.92.75.75 0 0 1-.1-1.05" />
  </svg>
);

/** Fluent `eraser_20_regular`. */
export const FluentRefEraserIcon = () => (
  <svg {...base}>
    <path d="M11.2 2.44a1.5 1.5 0 0 1 2.12 0l4.24 4.24a1.5 1.5 0 0 1 0 2.12L9.36 17h5.14a.5.5 0 1 1 0 1H7.82a1.5 1.5 0 0 1-1.14-.44l-4.24-4.24a1.5 1.5 0 0 1 0-2.12zm1.41.7a.5.5 0 0 0-.7 0L5.53 9.52l4.95 4.95 6.36-6.36a.5.5 0 0 0 0-.71zM9.78 15.18l-4.95-4.95-1.69 1.69a.5.5 0 0 0 0 .7l4.25 4.25c.2.2.5.2.7 0z" />
  </svg>
);

/** Fluent `eraser_20_filled`. */
export const FluentRefEraserFilledIcon = () => (
  <svg {...base}>
    <path d="M11.2 2.44a1.5 1.5 0 0 1 2.12 0l4.24 4.24a1.5 1.5 0 0 1 0 2.12L9.36 17h5.14a.5.5 0 1 1 0 1H7.82a1.5 1.5 0 0 1-1.14-.44l-4.24-4.24a1.5 1.5 0 0 1 0-2.12zM9.78 15.17l-4.95-4.95-1.69 1.69a.5.5 0 0 0 0 .7l4.25 4.25c.2.2.5.2.7 0z" />
  </svg>
);

/** Fluent `text_align_left_16_regular`. */
export const FluentRefTextAlignLeftIcon = () => (
  <svg {...base}>
    <path d="M1 3.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `text_align_left_16_filled`. */
export const FluentRefTextAlignLeftFilledIcon = () => (
  <svg {...base}>
    <path d="M1 3.75c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 3.75m0 4c0-.41.34-.75.75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75m0 4c0-.41.34-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75" />
  </svg>
);

/** Fluent `text_align_center_16_regular`. */
export const FluentRefTextAlignCenterIcon = () => (
  <svg {...base}>
    <path d="M3 3.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-2 4c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5m4 4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `text_align_center_16_filled`. */
export const FluentRefTextAlignCenterFilledIcon = () => (
  <svg {...base}>
    <path d="M3 3.75c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 3.75m-2 4c0-.41.34-.75.75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75m4 4c0-.41.34-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75" />
  </svg>
);

/** Fluent `text_indent_increase_ltr_16_regular`. */
export const FluentRefIndentIcon = () => (
  <svg {...base}>
    <path d="M11.5 3a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm3 4a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm-5 4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1zM1.85 5.65a.5.5 0 0 0-.7.7L2.29 7.5 1.15 8.65a.5.5 0 0 0 .7.7l1.5-1.5a.5.5 0 0 0 0-.7z" />
  </svg>
);

/** Fluent `text_indent_increase_ltr_16_filled`. */
export const FluentRefIndentFilledIcon = () => (
  <svg {...base}>
    <path d="M5.75 3a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zM2.28 5.72a.75.75 0 0 0-1.06 1.06l.97.97-.97.97a.75.75 0 0 0 1.06 1.06l1.5-1.5c.3-.3.3-.77 0-1.06z" />
  </svg>
);

/** Fluent `text_indent_decrease_ltr_16_regular`. */
export const FluentRefOutdentIcon = () => (
  <svg {...base}>
    <path d="M11.5 3a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm3 4a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm-5 4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1zM2.65 5.65a.5.5 0 0 1 .7.7L2.21 7.5l1.14 1.15a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7z" />
  </svg>
);

/** Fluent `text_indent_decrease_ltr_16_filled`. */
export const FluentRefOutdentFilledIcon = () => (
  <svg {...base}>
    <path d="M5.75 3a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zM2.72 5.72a.75.75 0 0 1 1.06 1.06l-.97.97.97.97a.75.75 0 0 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06z" />
  </svg>
);

/** Fluent `layout_column_two_16_regular`. */
export const FluentRefColumnsIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h3v10h-3A1.5 1.5 0 0 1 3 11.5zM8.5 13V3h3c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5z" />
  </svg>
);

/** Fluent `layout_column_two_16_filled`. */
export const FluentRefColumnsFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 14h3a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2h-3zm-1-12h-3A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h3z" />
  </svg>
);

/** Fluent `folder_dismiss_16_regular`. */
export const FluentRefFolderRemoveIcon = () => (
  <svg {...base}>
    <path d="M11.5 7a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9M5.59 2q.62.01 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v.76a6 6 0 0 0-1-.66v-.1c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7H2v4.5c0 .83.67 1.5 1.5 1.5h2.7q.15.52.4 1H3.5A2.5 2.5 0 0 1 1 11.5v-7A2.5 2.5 0 0 1 3.5 2zm7.76 7.65a.5.5 0 0 0-.7 0l-1.15 1.14-1.15-1.14a.5.5 0 1 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 1 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 1 0 .7-.7l-1.14-1.15 1.14-1.15a.5.5 0 0 0 0-.7M3.5 3C2.67 3 2 3.67 2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3z" />
  </svg>
);

/** Fluent `folder_dismiss_16_filled`. */
export const FluentRefFolderRemoveFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 7a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m1-3A2.5 2.5 0 0 1 15 6.5v.76A5.5 5.5 0 0 0 6.6 14H3.5A2.5 2.5 0 0 1 1 11.5V7h4.59q.62-.01 1.06-.44L9.2 4zm.85 5.65a.5.5 0 0 0-.7 0l-1.15 1.14-1.15-1.14a.5.5 0 1 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 1 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 1 0 .7-.7l-1.14-1.15 1.14-1.15a.5.5 0 0 0 0-.7M5.6 2q.62.01 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1V4.5A2.5 2.5 0 0 1 3.5 2z" />
  </svg>
);

/** Fluent `document_dismiss_16_regular`. */
export const FluentRefDocumentRemoveIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H8.66q.6-.42 1.08-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6.5 2h2.3L10 2.2v2.3c0 .28.22.5.5.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `document_dismiss_16_filled`. */
export const FluentRefDocumentRemoveFilledIcon = () => (
  <svg {...base}>
    <path d="M9 4.5V1H5.5C4.67 1 4 1.67 4 2.5v2.7A5.5 5.5 0 0 1 8.66 15h3.84c.83 0 1.5-.67 1.5-1.5V6h-3.5A1.5 1.5 0 0 1 9 4.5m1 0V1.25L13.75 5H10.5a.5.5 0 0 1-.5-.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `text_number_list_ltr_16_regular`. */
export const FluentRefListNumberedIcon = () => (
  <svg {...base}>
    <path d="M3.68 1.01c.2.04.33.21.33.4v3.3c0 .22-.19.4-.42.4a.4.4 0 0 1-.43-.4V2.58q-.27.24-.67.44a.44.44 0 0 1-.57-.19.4.4 0 0 1 .2-.55A2.5 2.5 0 0 0 3.2 1.23c.1-.17.29-.26.48-.22M2.15 7.06a.4.4 0 0 1 0-.59h.01l.11-.1.28-.17c.24-.13.6-.26 1.03-.26h.01c.32 0 .67.09.95.29q.46.31.48.95c0 .45-.2.76-.48.99-.22.17-.5.3-.72.4l-.1.06q-.4.17-.61.39a1 1 0 0 0-.15.22H4.6c.23 0 .42.18.42.4s-.19.42-.42.42H2.46a.4.4 0 0 1-.43-.41q.02-.76.44-1.19c.26-.27.6-.44.87-.57l.12-.06q.34-.15.53-.3.18-.13.18-.35-.01-.21-.14-.3a1 1 0 0 0-.45-.12 1.3 1.3 0 0 0-.82.3.44.44 0 0 1-.6 0m.94 5.88c0-.23.2-.41.43-.41.3 0 .46-.08.54-.15a.3.3 0 0 0 .1-.25c0-.16-.15-.42-.64-.42-.35 0-.53.08-.62.13l-.07.07v-.02.02a.44.44 0 0 1-.57.16.4.4 0 0 1-.19-.55l.01-.02.09-.12q.09-.11.26-.22.35-.26 1.1-.28c.87 0 1.47.56 1.5 1.22q.01.46-.35.84c.24.23.36.54.34.84C5 14.44 4.4 15 3.52 15q-.74-.02-1.1-.28a1 1 0 0 1-.34-.34v-.01h-.01a.4.4 0 0 1 .2-.56c.2-.1.44-.03.55.16l.08.07c.09.05.27.14.62.14.49 0 .64-.27.65-.43a.3.3 0 0 0-.11-.25c-.08-.07-.25-.15-.54-.15a.4.4 0 0 1-.43-.4M7.5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_number_list_ltr_16_filled`. */
export const FluentRefListNumberedFilledIcon = () => (
  <svg {...base}>
    <path d="M3.68 1.01c.2.04.33.21.33.4v3.3c0 .22-.19.4-.42.4a.4.4 0 0 1-.43-.4V2.58q-.27.24-.67.44a.44.44 0 0 1-.57-.19.4.4 0 0 1 .2-.55A2.5 2.5 0 0 0 3.2 1.23c.1-.17.29-.26.48-.22M2.15 7.06a.4.4 0 0 1 0-.59h.01l.11-.1.28-.17c.24-.13.6-.26 1.03-.26h.01c.32 0 .67.09.95.29q.46.31.48.95c0 .45-.2.76-.48.99-.22.17-.5.3-.72.4l-.1.06q-.4.17-.61.39a1 1 0 0 0-.15.22H4.6c.23 0 .42.18.42.4s-.19.42-.42.42H2.46a.4.4 0 0 1-.43-.41q.02-.76.44-1.19c.26-.27.6-.44.87-.57l.12-.06q.34-.15.53-.3.18-.13.18-.35-.01-.21-.14-.3a1 1 0 0 0-.45-.12 1.3 1.3 0 0 0-.82.3.44.44 0 0 1-.6 0m.94 5.88c0-.23.2-.41.43-.41.3 0 .46-.08.54-.15a.3.3 0 0 0 .1-.25c0-.16-.15-.42-.64-.42-.35 0-.53.08-.62.13l-.07.07v-.02.02a.44.44 0 0 1-.57.16.4.4 0 0 1-.19-.55l.01-.02.09-.12q.09-.11.26-.22.35-.26 1.1-.28c.87 0 1.47.56 1.5 1.22q.01.46-.35.84c.24.23.36.54.34.84C5 14.44 4.4 15 3.52 15q-.74-.02-1.1-.28a1 1 0 0 1-.34-.34v-.01h-.01a.4.4 0 0 1 .2-.56c.2-.1.44-.03.55.16l.08.07c.09.05.27.14.62.14.49 0 .64-.27.65-.43a.3.3 0 0 0-.11-.25c-.08-.07-.25-.15-.54-.15a.4.4 0 0 1-.43-.4M7.75 3a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `arrow_sort_up_lines_16_regular`. */
export const FluentRefSortAscendingIcon = () => (
  <svg {...base}>
    <path d="M13 14.5a.5.5 0 0 1-1 0V2.7l-1.15 1.15a.5.5 0 0 1-.7-.7l2-2c.2-.2.5-.2.7 0l2 2a.5.5 0 0 1-.7.7L13 2.71zM2.5 13a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm2-3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM6 6.5c0 .28.22.5.5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `arrow_sort_up_lines_16_filled`. */
export const FluentRefSortAscendingFilledIcon = () => (
  <svg {...base}>
    <path d="M13 14.25a.75.75 0 0 1-1.5 0V3.56l-.72.72a.75.75 0 1 1-1.06-1.06l2-2c.3-.3.77-.3 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L13 3.56zM2.75 13.5a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5zm2-3a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5zM6 6.75c0 .41.34.75.75.75h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 0-.75.75" />
  </svg>
);

/** Fluent `filter_dismiss_16_regular`. */
export const FluentRefFilterDismissIcon = () => (
  <svg {...base}>
    <path d="M6.26 9q.46.58 1.08 1H3.5a.5.5 0 0 1 0-1zM5.02 5a6 6 0 0 0 0 1H1.5a.5.5 0 0 1 0-1zm.48 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm5-3a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m1.85-6.35c.2.2.2.5 0 .7L11.21 5.5l1.14 1.15a.5.5 0 0 1-.7.7L10.5 6.21 9.35 7.35a.5.5 0 1 1-.7-.7L9.79 5.5 8.65 4.35a.5.5 0 1 1 .7-.7l1.15 1.14 1.15-1.14c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `filter_dismiss_16_filled`. */
export const FluentRefFilterDismissFilledIcon = () => (
  <svg {...base}>
    <path d="M6.26 9a5.5 5.5 0 0 0 1.95 1.5H3.5a.75.75 0 0 1 0-1.5zM5.02 5a6 6 0 0 0 .07 1.5H1.5a.75.75 0 0 1 0-1.5zm.48 8a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5zm5-3a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m1.85-6.35c.2.2.2.5 0 .7L11.21 5.5l1.14 1.15a.5.5 0 0 1-.7.7L10.5 6.21 9.35 7.35a.5.5 0 1 1-.7-.7L9.79 5.5 8.65 4.35a.5.5 0 1 1 .7-.7l1.15 1.14 1.15-1.14c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `bookmark_add_20_regular`. */
export const FluentRefBookmarkAddIcon = () => (
  <svg {...base}>
    <path d="M19 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H15zm0 13.02v-5.54q.51-.05 1-.19v6.71a.5.5 0 0 1-.8.4L10 14.12 4.8 17.9a.5.5 0 0 1-.8-.4v-13A2.5 2.5 0 0 1 6.5 2h3.76q-.39.46-.66 1H6.5C5.67 3 5 3.67 5 4.5v12.02l4.7-3.42a.5.5 0 0 1 .6 0z" />
  </svg>
);

/** Fluent `bookmark_add_20_filled`. */
export const FluentRefBookmarkAddFilledIcon = () => (
  <svg {...base}>
    <path d="M19 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H15zm-.5 7.5a6 6 0 0 0 1.5-.2v6.7a.5.5 0 0 1-.8.4L10 14.12 4.8 17.9a.5.5 0 0 1-.8-.4v-13A2.5 2.5 0 0 1 6.5 2h3.76a5.5 5.5 0 0 0 4.24 9" />
  </svg>
);

/** Fluent `arrow_reply_all_16_regular`. */
export const FluentRefReplyAllIcon = () => (
  <svg {...base}>
    <path d="M6.35 4.35a.5.5 0 1 0-.7-.7l-3.5 3.5a.5.5 0 0 0 0 .7l3.5 3.5a.5.5 0 0 0 .7-.7L3.21 7.5zm3 0a.5.5 0 1 0-.7-.7l-3.5 3.5a.5.5 0 0 0 0 .7l3.5 3.5a.5.5 0 0 0 .7-.7L6.71 8H8.5a4.5 4.5 0 0 1 4.5 4.5.5.5 0 0 0 1 0A5.5 5.5 0 0 0 8.5 7H6.7z" />
  </svg>
);

/** Fluent `arrow_reply_all_16_filled`. */
export const FluentRefReplyAllFilledIcon = () => (
  <svg {...base}>
    <path d="M10.03 3.22c.3.3.3.77 0 1.06L7.81 6.5h.44A5.75 5.75 0 0 1 14 12.25a.75.75 0 0 1-1.5 0C12.5 9.9 10.6 8 8.25 8h-.44l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5c.3-.3.77-.3 1.06 0m-3.25 0c.3.3.3.77 0 1.06L3.81 7.25l2.97 2.97a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5c.3-.3.77-.3 1.06 0" />
  </svg>
);

/** Fluent `zoom_fit_16_regular`. */
export const FluentRefZoomFitIcon = () => (
  <svg {...base}>
    <path d="M5.66 2.64a.5.5 0 0 0 .69.72l1.3-1.25a.5.5 0 0 1 .7 0l1.3 1.25a.5.5 0 1 0 .7-.72l-1.3-1.25a1.5 1.5 0 0 0-2.08 0zm-2.3 3.7a.5.5 0 0 0-.72-.69L1.39 6.96a1.5 1.5 0 0 0 0 2.08l1.25 1.3a.5.5 0 0 0 .72-.69l-1.25-1.3a.5.5 0 0 1 0-.7zm2.99 6.3a.5.5 0 1 0-.7.72l1.32 1.26c.58.55 1.5.55 2.08 0l1.3-1.26a.5.5 0 1 0-.7-.72l-1.3 1.25a.5.5 0 0 1-.69 0zm7.01-6.99a.5.5 0 1 0-.72.7l1.26 1.3c.18.2.18.5 0 .7l-1.26 1.3a.5.5 0 1 0 .72.7l1.26-1.3a1.5 1.5 0 0 0 0-2.09zM6.5 5C5.67 5 5 5.67 5 6.5v3c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zM6 6.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `zoom_fit_16_filled`. */
export const FluentRefZoomFitFilledIcon = () => (
  <svg {...base}>
    <path d="M5.65 2.64a.5.5 0 0 0 .7.72l1.3-1.25a.5.5 0 0 1 .7 0l1.3 1.25a.5.5 0 0 0 .7-.72l-1.3-1.25a1.5 1.5 0 0 0-2.08 0zm-2.29 3.7a.5.5 0 1 0-.72-.68l-1.25 1.3a1.5 1.5 0 0 0 0 2.08l1.25 1.3a.5.5 0 0 0 .72-.68L2.11 8.35a.5.5 0 0 1 0-.7zm2.99 6.3a.5.5 0 0 0-.7.72l1.32 1.26c.58.55 1.5.55 2.08 0l1.3-1.26a.5.5 0 1 0-.7-.72l-1.3 1.25a.5.5 0 0 1-.69 0zm7.01-6.99a.5.5 0 1 0-.72.7l1.26 1.3c.18.2.18.5 0 .7l-1.26 1.3a.5.5 0 1 0 .72.7l1.26-1.3a1.5 1.5 0 0 0 0-2.09zM5 6.5C5 5.67 5.67 5 6.5 5h3c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-3A1.5 1.5 0 0 1 5 9.5z" />
  </svg>
);

/** Fluent `paint_bucket_16_regular`. */
export const FluentRefPaintBucketIcon = () => (
  <svg {...base}>
    <path d="M7.5 1c.28 0 .5.22.5.5v.93q.24.1.43.3l3.72 3.7a1.5 1.5 0 0 1 0 2.13l-5.07 5.07c-.6.6-1.57.58-2.15-.03L1.31 9.8a1.5 1.5 0 0 1 .03-2.1L6.3 2.74q.3-.3.69-.4V1.5c0-.28.22-.5.5-.5M7 4.5V3.46L2.46 8h8.83l.15-.15a.5.5 0 0 0 0-.7L8 3.7v.79a.5.5 0 0 1-1 0M1.95 9l.09.11 3.62 3.8c.19.2.51.21.71.01L10.3 9zm10.97 1.22a.56.56 0 0 0-.84 0l-1.15 1.32a2.09 2.09 0 1 0 3.14 0zm-1.24 1.98.82-.94.82.94a1.09 1.09 0 1 1-1.64 0" />
  </svg>
);

/** Fluent `paint_bucket_16_filled`. */
export const FluentRefPaintBucketFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1.5a.5.5 0 0 0-1 0v.84q-.38.1-.69.39L1.34 7.71a1.5 1.5 0 0 0-.03 2.1l3.62 3.8a1.5 1.5 0 0 0 2.15.02l5.07-5.07a1.5 1.5 0 0 0 0-2.12L8.43 2.73a2 2 0 0 0-.43-.3zM11.3 8H2.45L7 3.46V4.5a.5.5 0 1 0 1 0v-.79l3.44 3.44c.2.2.2.5 0 .7zm1.62 2.22a.56.56 0 0 0-.84 0l-1.15 1.32a2.09 2.09 0 1 0 3.14 0z" />
  </svg>
);

/** Fluent `panel_bottom_20_regular`. */
export const FluentRefPanelBottomIcon = () => (
  <svg {...base}>
    <path d="M5 3a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM3 6c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v5H3zm0 6h14v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

/** Fluent `panel_bottom_20_filled`. */
export const FluentRefPanelBottomFilledIcon = () => (
  <svg {...base}>
    <path d="M2 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v5h14V6a2 2 0 0 0-2-2z" />
  </svg>
);

/** Fluent `panel_left_contract_16_regular`. */
export const FluentRefPanelLeftCloseIcon = () => (
  <svg {...base}>
    <path d="m9.7 8.5.65.65a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 0 1 .7.7l-.64.65h1.79a.5.5 0 0 1 0 1zM4 3a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM3 5a1 1 0 0 1 1-1h2v8H4a1 1 0 0 1-1-1zm4 7V4h5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1z" />
  </svg>
);

/** Fluent `panel_left_contract_16_filled`. */
export const FluentRefPanelLeftCloseFilledIcon = () => (
  <svg {...base}>
    <path d="m9.7 8.5.65.65a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 0 1 .7.7l-.64.65h1.79a.5.5 0 0 1 0 1zM4 3a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 9V4h5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1z" />
  </svg>
);

/** Fluent `panel_left_expand_16_regular`. */
export const FluentRefPanelLeftOpenIcon = () => (
  <svg {...base}>
    <path d="m9.65 9.15.64-.65H8.5a.5.5 0 0 1 0-1h1.8l-.65-.65a.5.5 0 1 1 .7-.7l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 1 1-.7-.7" />
    <path d="M2 5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2V4zm3 0v8h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `panel_left_expand_16_filled`. */
export const FluentRefPanelLeftOpenFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 7.5h1.8l-.66-.65a.5.5 0 0 1 .71-.7l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 1 1-.7-.7l.64-.65H8.5a.5.5 0 0 1 0-1" />
    <path d="M2 5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H7v8h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1" />
  </svg>
);

/** Fluent `checkbox_checked_16_regular`. */
export const FluentRefCheckboxIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5zm7.85 2.35a.5.5 0 0 0-.7-.7L7 9.29 5.85 8.15a.5.5 0 1 0-.7.7l1.5 1.5c.2.2.5.2.7 0z" />
  </svg>
);

/** Fluent `checkbox_checked_16_filled`. */
export const FluentRefCheckboxFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm6.35 4.85-3.5 3.5a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 1 1 .7-.7L7 9.29l3.15-3.14a.5.5 0 0 1 .7.7" />
  </svg>
);

/** Fluent `task_list_ltr_20_regular`. */
export const FluentRefListChecklistIcon = () => (
  <svg {...base}>
    <path d="M5.85 4.35a.5.5 0 1 0-.7-.7L3.5 5.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0zM8.5 5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM8 15.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.85 9.85a.5.5 0 1 0-.7-.7L3.5 10.79l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0zm0 4.3c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 1.65-1.64c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `task_list_ltr_20_filled`. */
export const FluentRefListChecklistFilledIcon = () => (
  <svg {...base}>
    <path d="M5.85 4.35a.5.5 0 1 0-.7-.7L3.5 5.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0zm2.9.15a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM8 15.25c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75m-2.15-5.4a.5.5 0 1 0-.7-.7L3.5 10.79l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0zm0 4.3c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 1.65-1.64c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `filter_add_16_regular`. */
export const FluentRefFilterAddIcon = () => (
  <svg {...base}>
    <path d="M8.5 13a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zM6.26 9q.46.58 1.08 1H3.5a.5.5 0 0 1 0-1zm4.24-8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m0 2a.5.5 0 0 0-.5.5V5H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H11V3.5a.5.5 0 0 0-.5-.5M5.02 5a6 6 0 0 0 0 1H1.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `filter_add_16_filled`. */
export const FluentRefFilterAddFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 13a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5zM6.26 9a5.5 5.5 0 0 0 1.95 1.5H3.5a.75.75 0 0 1 0-1.5zm4.24-8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m0 2a.5.5 0 0 0-.5.5V5H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H11V3.5a.5.5 0 0 0-.5-.5M5.02 5a6 6 0 0 0 .07 1.5H1.5a.75.75 0 0 1 0-1.5z" />
  </svg>
);

/** Fluent `pin_16_regular`. */
export const FluentRefPushpinIcon = () => (
  <svg {...base}>
    <path d="M10.06 2.45a1.5 1.5 0 0 0-2.39.35L5.65 6.59l-2.8.94a.5.5 0 0 0-.2.82l2.14 2.15-2.64 2.65L2 14l.85-.15 2.65-2.64 2.15 2.14a.5.5 0 0 0 .82-.2l.94-2.8 3.78-2.03a1.5 1.5 0 0 0 .35-2.38zm-1.5.82a.5.5 0 0 1 .8-.12l3.48 3.5a.5.5 0 0 1-.12.8l-3.96 2.1a.5.5 0 0 0-.23.3l-.75 2.22-3.85-3.85 2.23-.75a.5.5 0 0 0 .28-.23z" />
  </svg>
);

/** Fluent `pin_16_filled`. */
export const FluentRefPushpinFilledIcon = () => (
  <svg {...base}>
    <path d="M10.06 2.45a1.5 1.5 0 0 0-2.39.35L5.65 6.59l-2.8.94a.5.5 0 0 0-.2.82l2.14 2.15-2.64 2.65L2 14l.85-.15 2.65-2.64 2.15 2.14a.5.5 0 0 0 .82-.2l.94-2.8 3.78-2.03a1.5 1.5 0 0 0 .35-2.38z" />
  </svg>
);

/** Fluent `color_16_regular`. */
export const FluentRefPaletteIcon = () => (
  <svg {...base}>
    <path d="M7.5 5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M11.5 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M11 9.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M8 2a6 6 0 0 0-6 6c0 1.1.9 2 2 2 .7 0 1.09-.38 1.34-.63l.01-.02C5.6 9.11 5.72 9 6 9a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3c1.33 0 2.35-.75 3.02-1.85.65-1.1.98-2.57.98-4.15a6 6 0 0 0-6-6M3 8a5 5 0 0 1 10 0c0 1.46-.3 2.74-.84 3.63Q11.36 12.98 10 13a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2c-.7 0-1.09.38-1.34.63l-.01.02C4.4 8.89 4.28 9 4 9a1 1 0 0 1-1-1" />
  </svg>
);

/** Fluent `color_16_filled`. */
export const FluentRefPaletteFilledIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0c0 1.58-.33 3.05-.98 4.15C12.35 13.25 11.33 14 10 14a3 3 0 0 1-3-3v-1a1 1 0 0 0-1-1c-.28 0-.4.1-.65.35l-.01.02c-.25.25-.63.63-1.34.63a2 2 0 0 1-2-2m5.5-2.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M11.5 7a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M11 9.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-.5 1.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `arrow_circle_up_16_regular`. */
export const FluentRefArrowUpCircleIcon = () => (
  <svg {...base}>
    <path d="m5.15 7.15 2.5-2.5c.2-.2.5-.2.7 0l2.5 2.5a.5.5 0 0 1-.7.7L8.5 6.21V11a.5.5 0 0 1-1 0V6.2L5.85 7.86a.5.5 0 1 1-.7-.7M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8" />
  </svg>
);

/** Fluent `arrow_circle_up_16_filled`. */
export const FluentRefArrowUpCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m6.8-3.46-.15.1-2.5 2.5a.5.5 0 1 0 .7.71L7.5 6.21V11a.5.5 0 0 0 1 0V6.2l1.65 1.65a.5.5 0 0 0 .7-.7l-2.5-2.5a.5.5 0 0 0-.54-.11" />
  </svg>
);

/** Fluent `record_stop_16_regular`. */
export const FluentRefStopCircleIcon = () => (
  <svg {...base}>
    <path d="M6 5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m7-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `record_stop_16_filled`. */
export const FluentRefStopCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m5-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `compose_16_regular`. */
export const FluentRefComposeIcon = () => (
  <svg {...base}>
    <path d="M8.5 3a.5.5 0 0 1 0 1h-4C3.67 4 3 4.67 3 5.5v6c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5v-4a.5.5 0 0 1 1 0v4a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 2 11.5v-6A2.5 2.5 0 0 1 4.5 3zm4.65-.85a.5.5 0 1 1 .7.7l-6.79 6.8L6 10l.35-1.06z" />
  </svg>
);

/** Fluent `compose_16_filled`. */
export const FluentRefComposeFilledIcon = () => (
  <svg {...base}>
    <path d="M8.25 3a.75.75 0 0 1 0 1.5h-3.5c-.69 0-1.25.56-1.25 1.25v5.5c0 .69.56 1.25 1.25 1.25h5.5c.69 0 1.25-.56 1.25-1.25v-3.5a.75.75 0 0 1 1.5 0v3.5A2.75 2.75 0 0 1 10.25 14h-5.5A2.75 2.75 0 0 1 2 11.25v-5.5A2.75 2.75 0 0 1 4.75 3zm4.47-.78a.75.75 0 1 1 1.06 1.06L7.59 9.47 6 10l.53-1.6z" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `frame_16_regular`. */
export const FluentRefFrameIcon = () => (
  <svg {...base}>
    <path d="M4 1.5a.5.5 0 0 0-1 0V3H1.5a.5.5 0 0 0 0 1H3v8H1.5a.5.5 0 0 0 0 1H3v1.5a.5.5 0 0 0 1 0V13h8v1.5a.5.5 0 0 0 1 0V13h1.5a.5.5 0 0 0 0-1H13V4h1.5a.5.5 0 0 0 0-1H13V1.5a.5.5 0 0 0-1 0V3H4zM12 12H4V4h8z" />
  </svg>
);

/** Fluent `frame_16_filled`. */
export const FluentRefFrameFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 1c.28 0 .5.22.5.5V3h8V1.5a.5.5 0 0 1 1 0V3h1.5a.5.5 0 0 1 0 1H13v8h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V13H4v1.5a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H3V4H1.5a.5.5 0 0 1 0-1H3V1.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `hand_left_16_regular`. */
export const FluentRefHandIcon = () => (
  <svg {...base}>
    <path d="M8.5 2c.28 0 .5.22.5.5v4a.5.5 0 1 0 1 0v-3a.5.5 0 1 1 1 0v4a.5.5 0 1 0 1 0v-2a.5.5 0 0 1 1 0v4c0 .57-.25 1.3-.63 2.04-.38.73-.84 1.43-1.2 1.92-.25.34-.66.54-1.1.54H8.22c-.72 0-1.4-.56-1.74-1.36a11 11 0 0 0-2.28-3.3q-.6-.6-1-.91v-.01q.15-.18.3-.24a.7.7 0 0 1 .45-.09q.51.09 1.19.76A.5.5 0 0 0 6 8.5v-5a.5.5 0 0 1 1 0v3a.5.5 0 0 0 1 0v-4c0-.28.22-.5.5-.5M12 4.09V3.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 5 3.5v3.95q-.42-.26-.9-.35a1.7 1.7 0 0 0-1.08.2q-.52.3-.94.92a.5.5 0 0 0 .13.69l.02.01.35.28c.23.2.56.48.91.84a10 10 0 0 1 2.08 2.99C6 14.06 6.97 15 8.23 15h1.83c.74 0 1.46-.33 1.91-.95.38-.52.88-1.26 1.29-2.06.4-.78.74-1.68.74-2.49v-4a1.5 1.5 0 0 0-2-1.41m0 3.41Z" />
  </svg>
);

/** Fluent `hand_left_16_filled`. */
export const FluentRefHandFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 1.75a.75.75 0 0 1 1.5 0V6.5a.5.5 0 0 0 1 0V2.75a.75.75 0 0 1 1.5 0V7.5a.5.5 0 1 0 1 0V4.75a.75.75 0 0 1 1.5 0V9.5c0 .81-.34 1.71-.74 2.5-.41.79-.9 1.53-1.29 2.05-.45.62-1.17.95-1.9.95H7.73c-.96 0-1.8-.54-2.26-1.34a36 36 0 0 0-3.34-4.82l-.02-.01v-.01a.5.5 0 0 1 .03-.67q.54-.52 1.18-.49c.4.01.78.16 1.1.34q.3.17.57.38V2.75a.75.75 0 0 1 1.5 0V6.5a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `pin_off_16_regular`. */
export const FluentRefUnpinIcon = () => (
  <svg {...base}>
    <path d="m9.56 10.27 4.59 4.58a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7l4.58 4.59-.08.15-2.8.94a.5.5 0 0 0-.2.82l2.14 2.15-2.64 2.65L2 14l.85-.15 2.65-2.64 2.15 2.14a.5.5 0 0 0 .82-.2l.94-2.8zm-.74-.74-.06.03a.5.5 0 0 0-.23.28l-.75 2.23-3.85-3.85 2.23-.75a.5.5 0 0 0 .28-.23l.03-.06zm3.9-2.09-2.06 1.1.74.74 1.79-.96a1.5 1.5 0 0 0 .35-2.38l-3.48-3.5a1.5 1.5 0 0 0-2.39.36l-.95 1.8.73.73 1.1-2.06a.5.5 0 0 1 .8-.12l3.49 3.5a.5.5 0 0 1-.12.8" />
  </svg>
);

/** Fluent `pin_off_16_filled`. */
export const FluentRefUnpinFilledIcon = () => (
  <svg {...base}>
    <path d="m9.56 10.27 4.59 4.58a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7l4.58 4.59-.08.15-2.8.94a.5.5 0 0 0-.2.82l2.14 2.15-2.64 2.65L2 14l.85-.15 2.65-2.64 2.15 2.14a.5.5 0 0 0 .82-.2l.94-2.8zm3.63-1.95-1.79.96L6.72 4.6l.95-1.8a1.5 1.5 0 0 1 2.39-.34l3.48 3.5c.71.7.54 1.9-.35 2.37" />
  </svg>
);

/** Fluent `vehicle_truck_profile_16_regular`. */
export const FluentRefTruckIcon = () => (
  <svg {...base}>
    <path d="M2 3.75C2 2.78 2.78 2 3.75 2h5.5c.97 0 1.75.78 1.75 1.75V4h.38c.57 0 1.09.32 1.34.83l1.12 2.24q.16.3.16.67V11c0 .83-.67 1.5-1.5 1.5h-.56a2 2 0 0 1-3.88 0H6.94a2 2 0 0 1-3.91-.15A1.8 1.8 0 0 1 2 10.75zm6.06 7.75A2 2 0 0 1 10 10V3.75A.75.75 0 0 0 9.25 3h-5.5a.75.75 0 0 0-.75.75v7q0 .27.16.46a2 2 0 0 1 3.78.29zM11 10.27c.46.26.8.7.94 1.23h.56a.5.5 0 0 0 .5-.5V8h-2zM11 7h1.7l-.87-1.72a.5.5 0 0 0-.45-.28H11zm-6 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2m4 1a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

/** Fluent `vehicle_truck_profile_16_filled`. */
export const FluentRefTruckFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3.75C2 2.78 2.78 2 3.75 2h5.5c.97 0 1.75.78 1.75 1.75V4h.38c.57 0 1.09.32 1.34.83l1.12 2.24q.16.3.16.67V11c0 .83-.67 1.5-1.5 1.5h-.56a2 2 0 0 1-3.88 0H6.94a2 2 0 0 1-3.91-.15A1.8 1.8 0 0 1 2 10.75zM11 5v2h1.7l-.87-1.72a.5.5 0 0 0-.45-.28zm-6 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2m4 1a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

/** Fluent `building_shop_16_regular`. */
export const FluentRefStoreIcon = () => (
  <svg {...base}>
    <path d="M9 9.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm1 1.5h1v-1h-1zM4.19 1.11l-2.5 2c-.17.13-.19.36-.19.56V5.5q.02.86.5 1.5v7.5c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5V7q.48-.64.5-1.5V3.67c0-.2-.02-.43-.19-.56l-2.5-2A.5.5 0 0 0 11.5 1h-7a.5.5 0 0 0-.31.11M5.5 4v1.5a1.5 1.5 0 1 1-3 0V4zm4 0v1.5a1.5 1.5 0 1 1-3 0V4zm4 0v1.5a1.5 1.5 0 0 1-3 0V4zM6.03 2l-.38 1H3.43l1.25-1zm.7 1 .37-1h1.79l.33 1zm3.21-1h1.38l1.25 1h-2.3zM13 7.8V14H8V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V14H3V7.8A2.5 2.5 0 0 0 6 7a2.5 2.5 0 0 0 4 0 2.5 2.5 0 0 0 3 .8M7 14H5v-4h2z" />
  </svg>
);

/** Fluent `building_shop_16_filled`. */
export const FluentRefStoreFilledIcon = () => (
  <svg {...base}>
    <path d="M10 10v1h1v-1zM4.19 1.11l-2.5 2c-.17.13-.19.36-.19.56V5.5q.02.86.5 1.5v7.5c0 .28.22.5.5.5H4V9.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V15h5.5a.5.5 0 0 0 .5-.5V7q.48-.64.5-1.5V3.67c0-.2-.02-.43-.19-.56l-2.5-2A.5.5 0 0 0 11.5 1h-7a.5.5 0 0 0-.31.11M2.5 5.5V4h3v1.5a1.5 1.5 0 1 1-3 0m4 0V4h3v1.5a1.5 1.5 0 1 1-3 0m4 0V4h3v1.5a1.5 1.5 0 0 1-3 0M3.43 3l1.25-1h1.35l-.38 1zm3.3 0 .37-1h1.79l.33 1zm3.21-1h1.38l1.25 1h-2.3zM9 9.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zM5 15h2v-5H5z" />
  </svg>
);

/** Fluent `ticket_diagonal_16_regular`. */
export const FluentRefTicketIcon = () => (
  <svg {...base}>
    <path d="M8.17 1.51c.68-.68 1.79-.68 2.47 0l.67.67c.35.35.24.85-.02 1.12a1 1 0 0 0 1.41 1.4l.11-.08a.8.8 0 0 1 .94.01l.07.06.67.67c.68.68.68 1.8 0 2.47L7.83 14.5c-.64.64-1.65.68-2.34.12l-.13-.12-.67-.67c-.35-.35-.24-.86.02-1.12A1 1 0 0 0 3.3 11.3c-.26.26-.77.37-1.12.02l-.67-.67a1.75 1.75 0 0 1 0-2.47zm1.76.71a.75.75 0 0 0-1.06 0L6.9 4.19l.75.75a.5.5 0 0 1-.7.7l-.76-.74-3.97 3.97c-.3.3-.3.77 0 1.06l.52.52A2 2 0 0 1 4 10l.2.01a2 2 0 0 1 1.35 3.25l.52.52c.29.3.76.3 1.06 0l3.97-3.97-.74-.75a.5.5 0 0 1 .7-.7l.75.74 1.97-1.97c.3-.3.3-.77 0-1.06l-.52-.52q-.45.37-1.05.44L12 6a2 2 0 0 1-1.56-3.26zM8.36 6.35c.2-.2.5-.2.7 0l.59.59a.5.5 0 0 1-.7.7l-.6-.58a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `ticket_diagonal_16_filled`. */
export const FluentRefTicketFilledIcon = () => (
  <svg {...base}>
    <path d="M8.17 1.51c.68-.68 1.79-.68 2.47 0l.5.5c.34.34.24.84-.02 1.1q-.36.36-.37.89a1.25 1.25 0 0 0 2.13.88L13 4.8a.8.8 0 0 1 .94.02l.06.05.5.5c.68.68.68 1.8 0 2.47L12.5 9.81l-.77-.78a.5.5 0 0 0-.7.7l.77.78-3.98 3.98c-.64.64-1.65.68-2.34.12l-.13-.12-.5-.5c-.34-.34-.25-.84.02-1.1l.08-.1q.28-.33.29-.79a1.25 1.25 0 0 0-2.14-.88c-.26.26-.76.36-1.1.02l-.5-.5a1.75 1.75 0 0 1 0-2.47L5.5 4.19l.77.78a.5.5 0 0 0 .71-.7l-.78-.79zm.57 4.52a.5.5 0 0 0-.7.7l1.22 1.24a.5.5 0 0 0 .71-.7z" />
  </svg>
);

/** Fluent `board_16_regular`. */
export const FluentRefKanbanIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5V5h4.5V3zm4 0v7H13V4.5c0-.83-.67-1.5-1.5-1.5zm4.5 8H8.5v2h3c.83 0 1.5-.67 1.5-1.5zm-5.5 2V6H3v5.5c0 .83.67 1.5 1.5 1.5z" />
  </svg>
);

/** Fluent `board_16_filled`. */
export const FluentRefKanbanFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 2v3H2v-.5A2.5 2.5 0 0 1 4.5 2zm1 0v8H14V4.5A2.5 2.5 0 0 0 11.5 2zm5.5 9H8.5v3h3a2.5 2.5 0 0 0 2.5-2.5zm-6.5 3V6H2v5.5A2.5 2.5 0 0 0 4.5 14z" />
  </svg>
);

/** Fluent `highlight_16_regular`. */
export const FluentRefHighlighterIcon = () => (
  <svg {...base}>
    <path d="M2.5 1c.28 0 .5.22.5.5v3c0 .28.22.5.5.5h9a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 1 0v3c0 .65-.42 1.2-1 1.42V7a2 2 0 0 1-2 2v1.74c0 .51-.26.99-.69 1.26l-4.54 2.92A.5.5 0 0 1 5 14.5V9a2 2 0 0 1-2-2V5.91c-.58-.2-1-.76-1-1.41v-3c0-.28.22-.5.5-.5M6 9v4.58l3.77-2.42a.5.5 0 0 0 .23-.42V9zM4 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6H4z" />
  </svg>
);

/** Fluent `highlight_16_filled`. */
export const FluentRefHighlighterFilledIcon = () => (
  <svg {...base}>
    <path d="M3 1a1 1 0 0 0-1 1v2.5A1.5 1.5 0 0 0 3.45 6h.1-.05 9-.05.1-.05c.83 0 1.5-.67 1.5-1.5V2a1 1 0 0 0-1-1zm0 6c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2zm2 7.5V10h6v.74c0 .51-.26.99-.69 1.26l-4.54 2.92A.5.5 0 0 1 5 14.5" />
  </svg>
);

/** Fluent `fire_16_regular`. */
export const FluentRefFlameIcon = () => (
  <svg {...base}>
    <path d="M8.17 2.38q.42-.21.8-.3.05.82.41 1.59a17 17 0 0 0 1.32 2.25q.71 1.05 1.24 2.06.54 1.05.56 2.02c0 1.15-.34 2.15-.99 2.85a4 4 0 0 1-3 1.15c-1.4 0-2.37-.4-3.05-1.03a4.8 4.8 0 0 1-1-5.43l.13.25c.38.76 1.3 1.07 2.07.7.84-.43 1.08-1.47.72-2.24-.37-.81-.66-1.81-.4-2.6.2-.58.65-1 1.19-1.27M4.1 6.18v.01l-.02.03-.22.33a5.33 5.33 0 0 0-.74 4.06c.26 1.19.77 2.3 1.65 3.1A5.3 5.3 0 0 0 8.5 15c1.62 0 2.89-.54 3.75-1.47A5 5 0 0 0 13.5 10c0-.86-.28-1.69-.67-2.46a21 21 0 0 0-1.35-2.25c-.47-.73-.9-1.4-1.19-2.03A2.8 2.8 0 0 1 10 1.6.5.5 0 0 0 9.5 1c-.42 0-1.12.15-1.79.5a3.3 3.3 0 0 0-1.68 1.84c-.4 1.17.06 2.5.44 3.32.17.38.02.79-.26.93a.54.54 0 0 1-.73-.24l-.53-1.07a.5.5 0 0 0-.84-.1" />
  </svg>
);

/** Fluent `fire_16_filled`. */
export const FluentRefFlameFilledIcon = () => (
  <svg {...base}>
    <path d="m4.11 6.19-.02.03-.22.33a5.33 5.33 0 0 0-.74 4.06c.26 1.19.77 2.3 1.65 3.1A5.3 5.3 0 0 0 8.5 15c1.62 0 2.89-.54 3.75-1.47A5 5 0 0 0 13.5 10c0-.86-.28-1.69-.67-2.46-.36-.74-.83-1.47-1.28-2.15l-.07-.1c-.47-.73-.9-1.4-1.19-2.03A2.8 2.8 0 0 1 10 1.6.5.5 0 0 0 9.5 1c-.42 0-1.12.15-1.79.5a3.3 3.3 0 0 0-1.68 1.84c-.4 1.17.06 2.5.44 3.32.17.38.02.79-.26.93a.54.54 0 0 1-.73-.24l-.53-1.07a.5.5 0 0 0-.84-.1" />
  </svg>
);

/** Fluent `leaf_one_16_regular`. */
export const FluentRefLeafIcon = () => (
  <svg {...base}>
    <path d="M7.5 13.02v1.48a.5.5 0 0 0 1 0v-1.48a4.89 4.89 0 0 0 2.77-8.49l-2.43-2.2a1.25 1.25 0 0 0-1.68 0l-2.43 2.2a4.89 4.89 0 0 0 2.77 8.5m3.1-7.74a3.89 3.89 0 0 1-2.1 6.74V7.5a.5.5 0 0 0-1 0v4.52a3.89 3.89 0 0 1-2.1-6.74l2.43-2.2q.17-.13.34 0z" />
  </svg>
);

/** Fluent `leaf_one_16_filled`. */
export const FluentRefLeafFilledIcon = () => (
  <svg {...base}>
    <path d="M11.27 4.54a4.89 4.89 0 0 1-2.77 8.48v1.48a.5.5 0 1 1-1 0v-1.48a4.89 4.89 0 0 1-2.77-8.49l2.43-2.2c.48-.42 1.2-.42 1.68 0zM8.5 7.5a.5.5 0 0 0-1 0v4.52q.5.06 1 0z" />
  </svg>
);

/** Fluent `umbrella_20_regular`. */
export const FluentRefUmbrellaIcon = () => (
  <svg {...base}>
    <path d="M8.51 9.13c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05a.5.5 0 0 0 .84 0l.03-.05a3 3 0 0 1 .56-.6c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05A.5.5 0 0 0 18 9.5C18 5.72 14.78 2 10 2S2 5.72 2 9.5a.5.5 0 0 0 .92.28l.03-.05a3 3 0 0 1 .56-.6c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05a.5.5 0 0 0 .84 0l.03-.05a3 3 0 0 1 .56-.6m-5.35-1A6.9 6.9 0 0 1 10 3a6.9 6.9 0 0 1 6.84 5.13A3 3 0 0 0 15 7.5c-.92 0-1.66.46-2.14.87q-.21.18-.36.35-.15-.17-.36-.35A3.3 3.3 0 0 0 10 7.5c-.92 0-1.66.46-2.14.87q-.21.18-.36.35-.15-.17-.36-.35A3.3 3.3 0 0 0 5 7.5c-.74 0-1.37.3-1.84.63M10 9.5q-.23 0-.5.15v6.1a1.25 1.25 0 1 1-2.5 0v-.25a.5.5 0 0 0-1 0v.25a2.25 2.25 0 0 0 4.5 0v-6.1q-.27-.15-.5-.15" />
  </svg>
);

/** Fluent `umbrella_20_filled`. */
export const FluentRefUmbrellaFilledIcon = () => (
  <svg {...base}>
    <path d="M8.51 9.13c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05a.5.5 0 0 0 .84 0l.03-.05a3 3 0 0 1 .56-.6c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05A.5.5 0 0 0 18 9.5C18 5.72 14.78 2 10 2S2 5.72 2 9.5a.5.5 0 0 0 .92.28l.03-.05a3 3 0 0 1 .56-.6c.4-.34.9-.63 1.49-.63.58 0 1.1.3 1.49.63a4 4 0 0 1 .56.6l.03.05a.5.5 0 0 0 .84 0l.03-.05a3 3 0 0 1 .56-.6M10 9.5q-.23 0-.5.15v6.1a1.25 1.25 0 1 1-2.5 0v-.25a.5.5 0 0 0-1 0v.25a2.25 2.25 0 0 0 4.5 0v-6.1q-.27-.15-.5-.15" />
  </svg>
);

/** Fluent `weather_snowflake_20_regular`. */
export const FluentRefSnowflakeIcon = () => (
  <svg {...base}>
    <path d="M10 2c.28 0 .5.22.5.5v3.04l1.9-1.9a.5.5 0 0 1 .7.71l-2.6 2.6V9.5h2.54l2.6-2.6a.5.5 0 0 1 .71.7l-1.9 1.9h3.05a.5.5 0 0 1 0 1h-3.04l1.9 1.9a.5.5 0 0 1-.71.7l-2.6-2.6H10.5v2.54l2.6 2.6a.5.5 0 0 1-.7.71l-1.9-1.9v3.05a.5.5 0 0 1-1 0v-3.04l-1.9 1.9a.5.5 0 0 1-.7-.71l2.6-2.6V10.5H6.96l-2.6 2.6a.5.5 0 0 1-.71-.7l1.9-1.9H2.5a.5.5 0 0 1 0-1h3.04l-1.9-1.9a.5.5 0 1 1 .71-.7l2.6 2.6H9.5V6.96l-2.6-2.6a.5.5 0 1 1 .7-.71l1.9 1.9V2.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `weather_snowflake_20_filled`. */
export const FluentRefSnowflakeFilledIcon = () => (
  <svg {...base}>
    <path d="M10 2c.41 0 .75.34.75.75v2.19l1.47-1.47a.75.75 0 1 1 1.06 1.06l-2.53 2.53v2.19h2.19l2.53-2.53a.75.75 0 1 1 1.06 1.06l-1.47 1.47h2.19a.75.75 0 0 1 0 1.5h-2.19l1.47 1.47a.75.75 0 1 1-1.06 1.06l-2.53-2.53h-2.19v2.19l2.53 2.53a.75.75 0 1 1-1.06 1.06l-1.47-1.47v2.19a.75.75 0 0 1-1.5 0v-2.19l-1.47 1.47a.75.75 0 0 1-1.06-1.06l2.53-2.53v-2.19H7.06l-2.53 2.53a.75.75 0 0 1-1.06-1.06l1.47-1.47H2.75a.75.75 0 0 1 0-1.5h2.19L3.47 7.78a.75.75 0 0 1 1.06-1.06l2.53 2.53h2.19V7.06L6.72 4.53a.75.75 0 0 1 1.06-1.06l1.47 1.47V2.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `temperature_16_regular`. */
export const FluentRefThermometerIcon = () => (
  <svg {...base}>
    <path d="M5 3.5a2.5 2.5 0 1 1 5 0v5.45a3.49 3.49 0 0 1-2.5 5.95A3.5 3.5 0 0 1 5 8.95zM7.5 2C6.67 2 6 2.67 6 3.5v5.89l-.17.15A2.5 2.5 0 0 0 7.5 13.9a2.5 2.5 0 0 0 1.67-4.36L9 9.39V3.5C9 2.67 8.33 2 7.5 2M8 6a.5.5 0 0 0-1 0v4.09a1.5 1.5 0 1 0 1 0z" />
  </svg>
);

/** Fluent `temperature_16_filled`. */
export const FluentRefThermometerFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 3.5a3 3 0 1 1 6 0v5.35a3.99 3.99 0 0 1-3 6.65 4 4 0 0 1-3-6.65zm3-1.5C6.67 2 6 2.67 6 3.5v5.97l-.23.23a2.5 2.5 0 1 0 3.46 0L9 9.47V3.5C9 2.67 8.33 2 7.5 2M8 6a.5.5 0 0 0-1 0v4.09a1.5 1.5 0 1 0 1 0z" />
  </svg>
);

/** Fluent `translate_16_regular`. */
export const FluentRefTranslateIcon = () => (
  <svg {...base}>
    <path d="M3.57 2.76a4 4 0 0 1 1.92.04c.74.21 1.14.69 1.34 1.23.17.5.17 1.03.17 1.4V9a.5.5 0 0 1-1 0v-.36q-.24.13-.5.24c-.57.25-1.31.43-2.07.2-1.7-.53-1.92-2.82-.46-3.71a4 4 0 0 1 2.37-.35q.36.04.65.1 0-.42-.1-.75c-.1-.27-.27-.5-.68-.61a2.7 2.7 0 0 0-1.96.17.5.5 0 0 1-.5-.86l.02-.02.22-.1q.21-.1.58-.2M6 6.14a8 8 0 0 0-.77-.12c-.67-.08-1.33-.04-1.74.2-.75.47-.61 1.64.23 1.9.44.13.92.04 1.39-.16.35-.14.65-.33.89-.48zm5.1-.63a.5.5 0 0 1 .39.6l-.14.66a13 13 0 0 0 1.53-.26.5.5 0 0 1 .23.98q-.92.21-1.92.3l-.1.84q.48-.12.9-.15a.5.5 0 0 1 1 .02v.03q.33.07.6.19c.72.31 1.2.9 1.38 1.57.36 1.37-.46 2.97-2.3 3.68a.5.5 0 0 1-.35-.94c1.46-.56 1.89-1.7 1.68-2.48q-.15-.6-.8-.91l-.3-.1a5 5 0 0 1-1.56 2.91l.13.38a.5.5 0 0 1-.94.34l-.04-.12q-.33.17-.66.24c-.47.1-1.01.07-1.4-.32-.55-.57-.59-1.5-.2-2.3.33-.65.93-1.25 1.84-1.67q.03-.54.1-1.14a13 13 0 0 1-1.2-.03.5.5 0 1 1 .06-1q.63.05 1.3.02.07-.46.18-.96a.5.5 0 0 1 .6-.38m-1.06 4.64q-.68.46-.9.96c-.28.55-.16.98.01 1.16.04.04.17.11.47.05q.27-.06.6-.27-.16-.78-.18-1.9m1.07 1.09c.35-.45.64-1.04.79-1.74a5 5 0 0 0-.86.19q-.01.89.07 1.55" />
  </svg>
);

/** Fluent `translate_16_filled`. */
export const FluentRefTranslateFilledIcon = () => (
  <svg {...base}>
    <path d="M3.12 4.21c.32-.18 1-.3 1.58-.16q.41.1.6.3.08.1.14.24a9 9 0 0 0-1.35-.05c-.37.03-.8.1-1.17.29q-.91.44-1.29 1.24a2.6 2.6 0 0 0-.11 1.58c.12.6.56 1.4 1.5 1.72q1.03.38 2.5-.19A.75.75 0 0 0 7 9V5q0-1.01-.6-1.65a2.6 2.6 0 0 0-1.34-.76 4 4 0 0 0-2.67.3.75.75 0 0 0 .73 1.32m2.38 1.9v1.44c-1.07.54-1.68.51-1.98.4a.8.8 0 0 1-.53-.6q-.09-.5.02-.67c.05-.13.19-.31.58-.5q.2-.1.61-.14a5 5 0 0 1 1.3.08m5.99.04a.75.75 0 0 0-1.47-.3q-.08.34-.13.69l-1.05-.08a.75.75 0 1 0-.16 1.49l1 .08-.05.84Q9.3 9 9 9.18c-1.04.62-1.83 1.74-1.4 3.05a2 2 0 0 0 1.3 1.3 3 3 0 0 0 1.59.07.75.75 0 0 0 1.27-.49c.69-.4 1.29-1 1.53-1.8q.13-.45.22-.83c.36.27.54.61.56.92.03.45-.25 1.18-1.58 1.68a.75.75 0 1 0 .53 1.4c1.71-.64 2.64-1.85 2.54-3.19a2.9 2.9 0 0 0-1.79-2.39v-.23a.75.75 0 0 0-1.47-.14 6 6 0 0 0-1.14-.01q0-.27.04-.54a8 8 0 0 0 2.08-.52.75.75 0 1 0-.54-1.4 7 7 0 0 1-1.3.37zM9 11.77c-.12-.38.03-.86.7-1.27q.1.8.29 1.65-.39.04-.63-.04-.29-.09-.36-.34m2.83-.88q-.1.34-.44.64-.17-.78-.23-1.5.43-.06.9-.01z" />
  </svg>
);

/** Fluent `text_line_spacing_16_regular`. */
export const FluentRefLineHeightIcon = () => (
  <svg {...base}>
    <path d="M12.5 9c.28 0 .5.22.5.5v3.8l.65-.65a.5.5 0 0 1 .7.7l-1.5 1.5a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 0 1 .7-.7l.65.64V9.5c0-.28.22-.5.5-.5m-6 2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm3-4a.5.5 0 0 1 0 1h-8a.5.5 0 1 1 0-1zm2.72-5.92a.5.5 0 0 1 .63.07l1.5 1.5a.5.5 0 0 1-.7.7L13 2.71V6.5a.5.5 0 1 1-1 0V2.7l-.65.65a.5.5 0 0 1-.7-.7l1.5-1.5zM6.5 3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `text_line_spacing_16_filled`. */
export const FluentRefLineHeightFilledIcon = () => (
  <svg {...base}>
    <path d="M12.75 9c.41 0 .75.34.75.75v2.69l.22-.22a.75.75 0 0 1 1.06 1.06l-1.5 1.5c-.27.27-.7.3-1 .05l-.06-.05-1.5-1.5a.75.75 0 0 1 1.06-1.06l.22.22V9.75c0-.41.34-.75.75-.75m-6.5 2a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5zm3-4a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5zm3.03-5.83a.75.75 0 0 1 1 .05l1.5 1.5a.75.75 0 0 1-1.06 1.06l-.22-.22v2.69a.75.75 0 0 1-1.5 0V3.56l-.22.22a.75.75 0 1 1-1.06-1.06l1.5-1.5zM6.25 3a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5z" />
  </svg>
);

/** Fluent `blur_16_regular`. */
export const FluentRefBlurIcon = () => (
  <svg {...base}>
    <path d="M8 2a6 6 0 1 0 4.47 10H8v1A5 5 0 0 1 8 3h3.32c-.95-.63-2.1-1-3.32-1m0 2h4.47q.42.45.73 1H8zm5.66 2H8v1h5.92a6 6 0 0 0-.26-1M8 8h6q0 .5-.08 1H8zm5.66 2H8v1h5.2q.28-.48.46-1" />
  </svg>
);

/** Fluent `blur_16_filled`. */
export const FluentRefBlurFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a6 6 0 1 0 4.47 10H8v-1h5.2q.28-.48.46-1H8V9h5.92q.08-.5.08-1H8V7h5.92a6 6 0 0 0-.26-1H8V5h5.2q-.31-.55-.73-1H8V3h3.32c-.95-.63-2.1-1-3.32-1" />
  </svg>
);

/** Fluent `square_shadow_16_regular`. */
export const FluentRefShadowIcon = () => (
  <svg {...base}>
    <path d="M8.5 1A2.5 2.5 0 0 1 11 3.5V5h1.5A2.5 2.5 0 0 1 15 7.5V12a3 3 0 0 1-3 3H7.5A2.5 2.5 0 0 1 5 12.5V11H3.5A2.5 2.5 0 0 1 1 8.5v-5A2.5 2.5 0 0 1 3.5 1zm-5 1C2.67 2 2 2.67 2 3.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5C10 2.67 9.33 2 8.5 2z" />
  </svg>
);

/** Fluent `square_shadow_16_filled`. */
export const FluentRefShadowFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 1A2.5 2.5 0 0 1 11 3.5V5h1.5A2.5 2.5 0 0 1 15 7.5V12a3 3 0 0 1-3 3H7.5A2.5 2.5 0 0 1 5 12.5V11H3.5A2.5 2.5 0 0 1 1 8.5v-5A2.5 2.5 0 0 1 3.5 1zm-5 1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `animal_paw_print_16_regular`. */
export const FluentRefPawIcon = () => (
  <svg {...base}>
    <path d="M9.5 3.88c0-.59.37-.88.63-.88.25 0 .62.3.62.88s-.37.87-.62.87c-.26 0-.63-.3-.63-.87M10.13 2c-1 0-1.63.94-1.63 1.88s.64 1.87 1.63 1.87 1.62-.94 1.62-1.87S11.11 2 10.13 2M2.37 5.25c-.25 0-.62.3-.62.88s.37.87.63.87c.25 0 .62-.3.62-.87 0-.59-.37-.88-.62-.88m-1.62.88c0-.94.64-1.88 1.63-1.88S4 5.19 4 6.13 3.36 8 2.38 8c-1 0-1.63-.94-1.63-1.87m12.88-.88c-.26 0-.63.3-.63.88s.37.87.63.87c.25 0 .62-.3.62-.87 0-.59-.37-.88-.62-.88M12 6.13c0-.94.64-1.88 1.63-1.88s1.62.94 1.62 1.88S14.61 8 13.63 8c-1 0-1.63-.94-1.63-1.87M5.88 3c-.26 0-.63.3-.63.88s.37.87.63.87c.25 0 .62-.3.62-.87 0-.59-.37-.88-.62-.88m-1.63.88c0-.94.64-1.88 1.63-1.88s1.62.94 1.62 1.88-.64 1.87-1.62 1.87c-1 0-1.63-.94-1.63-1.87M4 12a4 4 0 1 1 8 0c0 .53-.53 1-1.29 1H5.3C4.53 13 4 12.53 4 12m4-5a5 5 0 0 0-5 5c0 1.3 1.21 2 2.29 2h5.42c1.08 0 2.29-.7 2.29-2a5 5 0 0 0-5-5" />
  </svg>
);

/** Fluent `animal_paw_print_16_filled`. */
export const FluentRefPawFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 3.88c0-.94.64-1.88 1.63-1.88s1.62.94 1.62 1.88-.64 1.87-1.62 1.87c-1 0-1.63-.94-1.63-1.87m-6.12.37c-1 0-1.63.94-1.63 1.88S1.39 8 2.38 8 4 7.06 4 6.13s-.64-1.88-1.62-1.88m11.25 0c-1 0-1.63.94-1.63 1.88S12.64 8 13.63 8s1.62-.94 1.62-1.87-.64-1.88-1.62-1.88M5.87 2c-.98 0-1.62.94-1.62 1.88s.64 1.87 1.63 1.87S7.5 4.81 7.5 3.88 6.86 2 5.88 2M8 7a5 5 0 0 0-5 5c0 1.3 1.21 2 2.29 2h5.42c1.08 0 2.29-.7 2.29-2a5 5 0 0 0-5-5" />
  </svg>
);

/** Fluent `airplane_16_regular`. */
export const FluentRefPlaneIcon = () => (
  <svg {...base}>
    <path d="M7.04 2.28C6.94 1.61 7.46 1 8.14 1s1.3.4 1.57 1l1.88 4.07Q12.29 6 13 6a2 2 0 1 1 0 4q-.7-.01-1.41-.07L9.7 14c-.28.6-.9 1-1.56 1-.69 0-1.2-.6-1.1-1.28l.6-3.97-1.53-.08-.92 1.61c-.25.45-.73.72-1.24.72a.96.96 0 0 1-.96-.96V9.52l-.51-.02a1.5 1.5 0 0 1 0-3L3 6.48V4.96c0-.53.43-.96.96-.96.51 0 .99.27 1.24.72l.92 1.6 1.54-.07zM8.14 2a.1.1 0 0 0-.1.13L8.8 7.2l-3.25.16L4.33 5.2a.4.4 0 0 0-.33-.2v2.42l-1.49.07H2.5a.5.5 0 0 0 0 1h.01L4 8.57V11q.22-.03.33-.21l1.23-2.15 3.25.16-.78 5.07q0 .12.12.13c.28 0 .54-.16.65-.42l2.16-4.68 1.94.1h.1a1 1 0 1 0-.1-2l-1.94.1L8.8 2.42A.7.7 0 0 0 8.15 2" />
  </svg>
);

/** Fluent `airplane_16_filled`. */
export const FluentRefPlaneFilledIcon = () => (
  <svg {...base}>
    <path d="M7.9 1A.9.9 0 0 0 7 2.05l.69 4.43-1.88.17L4.57 4.5A1 1 0 0 0 3.73 4c-.4 0-.73.33-.73.73v2.18L1.97 7a1 1 0 0 0 0 2L3 9.1v2.17c0 .4.33.73.73.73.35 0 .67-.19.84-.49L5.8 9.35l1.88.17-.68 4.43A.9.9 0 0 0 7.9 15c.51 0 .98-.3 1.2-.77l2.02-4.4c.62.06 1.25.17 1.87.17a2 2 0 1 0 0-4c-.62 0-1.25.11-1.87.17L9.1 1.77A1.3 1.3 0 0 0 7.9 1" />
  </svg>
);

/** Fluent `branch_request_16_regular`. */
export const FluentRefGitPullRequestIcon = () => (
  <svg {...base}>
    <path d="M13 10.05V5.5A2.5 2.5 0 0 0 10.5 3H8.71l1.14-1.15c.2-.19.2-.51 0-.7a.5.5 0 0 0-.7 0l-2 2c-.2.19-.2.51 0 .7l2 2c.19.2.51.2.7 0 .2-.19.2-.51 0-.7L8.71 4h1.79c.83 0 1.5.67 1.5 1.5v4.55a2.5 2.5 0 1 0 1 0M12.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M6 3.5a2.5 2.5 0 1 0-3 2.45v4.1a2.5 2.5 0 1 0 1 0v-4.1A2.5 2.5 0 0 0 6 3.5m-4 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m3 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
  </svg>
);

/** Fluent `branch_request_16_filled`. */
export const FluentRefGitPullRequestFilledIcon = () => (
  <svg {...base}>
    <path d="M13 10.05V5.5A2.5 2.5 0 0 0 10.5 3H8.71l1.14-1.15c.2-.19.2-.51 0-.7a.5.5 0 0 0-.7 0l-2 2c-.2.19-.2.51 0 .7l2 2c.19.2.51.2.7 0 .2-.19.2-.51 0-.7L8.71 4h1.79c.83 0 1.5.67 1.5 1.5v4.55a2.5 2.5 0 1 0 1 0M6 3.5a2.5 2.5 0 1 0-3 2.45v4.1a2.5 2.5 0 1 0 1 0v-4.1A2.5 2.5 0 0 0 6 3.5" />
  </svg>
);

/** Fluent `document_code_16_regular`. */
export const FluentRefFileCodeIcon = () => (
  <svg {...base}>
    <path d="M7.14 7.02a.5.5 0 0 1 .35.62l-2 7a.5.5 0 0 1-.94.07.5.5 0 0 1-.03-.35l2-7a.5.5 0 0 1 .62-.34M9.6 1c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H6.42l.03-.09.26-.91H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v5.4a3 3 0 0 0-1-.66V3c0-1.1.9-2 2-2zM10 4.5c0 .28.22.5.5.5h2.3L10 2.2zM2.62 8.67a.5.5 0 0 1 .76.65l-1.22 1.43 1.22 1.42a.5.5 0 0 1-.76.65l-1.5-1.75a.5.5 0 0 1 0-.65zm6.05-.05a.5.5 0 0 1 .71.05l1.5 1.75a.5.5 0 0 1 0 .65l-1.5 1.75a.5.5 0 0 1-.76-.65l1.22-1.42-1.22-1.43a.5.5 0 0 1 .05-.7" />
  </svg>
);

/** Fluent `document_code_16_filled`. */
export const FluentRefFileCodeFilledIcon = () => (
  <svg {...base}>
    <path d="M7.14 7.02a.5.5 0 0 1 .35.62l-2 7a.5.5 0 0 1-.94.07.5.5 0 0 1-.03-.35l2-7a.5.5 0 0 1 .62-.34M9 4.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5H8.85l1.94-2.3.85-.98a1.5 1.5 0 0 0 0-1.95l-1.5-1.75-.1-.11a1.5 1.5 0 0 0-1.54-.33 1.5 1.5 0 0 0-.94-1.47l-.14-.05-.15-.04a1.5 1.5 0 0 0-1.66.92l-.05.15-.42 1.46A3 3 0 0 0 4 7.74V2.5C4 1.67 4.67 1 5.5 1H9zM2.62 8.67a.5.5 0 0 1 .76.65l-1.22 1.43 1.22 1.42a.5.5 0 0 1-.76.65l-1.5-1.75a.5.5 0 0 1 0-.65zm6.05-.05a.5.5 0 0 1 .71.05l1.5 1.75a.5.5 0 0 1 0 .65l-1.5 1.75a.5.5 0 0 1-.76-.65l1.22-1.42-1.22-1.43a.5.5 0 0 1 .05-.7M13.75 5H10.5a.5.5 0 0 1-.5-.5V1.25z" />
  </svg>
);

/** Fluent `document_image_16_regular`. */
export const FluentRefFileImageIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v3h1V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1h-1.04q-.07.53-.3 1H12a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06l-2.91-2.91A1.5 1.5 0 0 0 9.59 1zm6.8 4h-2.3a.5.5 0 0 1-.5-.5V2.2zM1 9.5A2.5 2.5 0 0 1 3.5 7h4A2.5 2.5 0 0 1 10 9.5v4q-.01.77-.41 1.38l-3.03-3.03a1.5 1.5 0 0 0-2.12 0L1.4 14.88q-.4-.6-.41-1.38zm7 .25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0m-5.88 5.84q.6.4 1.38.41h4q.77-.01 1.38-.41l-3.03-3.03a.5.5 0 0 0-.7 0z" />
  </svg>
);

/** Fluent `document_image_16_filled`. */
export const FluentRefFileImageFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1v3.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5h-1.84q.34-.68.34-1.5v-4A3.5 3.5 0 0 0 7.5 6H4V2.5C4 1.67 4.67 1 5.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zM1 9.5A2.5 2.5 0 0 1 3.5 7h4A2.5 2.5 0 0 1 10 9.5v4q-.01.77-.41 1.38l-3.03-3.03a1.5 1.5 0 0 0-2.12 0L1.4 14.88q-.4-.6-.41-1.38zm7 .25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0m-5.88 5.84q.6.4 1.38.41h4q.77-.01 1.38-.41l-3.03-3.03a.5.5 0 0 0-.7 0z" />
  </svg>
);

/** Fluent `news_16_regular`. */
export const FluentRefNewspaperIcon = () => (
  <svg {...base}>
    <path d="M3.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zM4 9V8h1v1zm3.5-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM1 4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2 2 2 0 0 1 2 2v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zm11.5 6.5a.5.5 0 0 1-.5-.5V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V6a1 1 0 0 0-1-1v5a.5.5 0 0 1-.5.5" />
  </svg>
);

/** Fluent `news_16_filled`. */
export const FluentRefNewspaperFilledIcon = () => (
  <svg {...base}>
    <path d="M4 9V8h1v1zM1 4c0-1.1.9-2 2-2h7a2 2 0 0 1 2 2v6.5a.5.5 0 0 0 1 0V4a2 2 0 0 1 2 2v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zm2.5 1a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm4 0a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `contact_card_16_regular`. */
export const FluentRefIdCardIcon = () => (
  <svg {...base}>
    <path d="M1 4.75C1 3.78 1.78 3 2.75 3h10.5c.97 0 1.75.78 1.75 1.75v6.5c0 .97-.78 1.75-1.75 1.75H2.75C1.78 13 1 12.22 1 11.25zM2.75 4a.75.75 0 0 0-.75.75v6.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75v-6.5a.75.75 0 0 0-.75-.75zM9.5 6a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM5.26 7.71a1.36 1.36 0 1 0 0-2.71 1.36 1.36 0 0 0 0 2.71m-1.4.68a.86.86 0 0 0-.86.86c0 .77.52 1.43 1.27 1.62l.05.01q.95.24 1.88 0h.06a1.7 1.7 0 0 0 1.26-1.63.86.86 0 0 0-.86-.86z" />
  </svg>
);

/** Fluent `contact_card_16_filled`. */
export const FluentRefIdCardFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.75C1 3.78 1.78 3 2.75 3h10.5c.97 0 1.75.78 1.75 1.75v6.5c0 .97-.78 1.75-1.75 1.75H2.75C1.78 13 1 12.22 1 11.25zm4.26 2.96a1.36 1.36 0 1 0 0-2.71 1.36 1.36 0 0 0 0 2.71m-1.4.68a.86.86 0 0 0-.86.86c0 .77.52 1.43 1.27 1.62l.05.01q.95.24 1.88 0h.06a1.7 1.7 0 0 0 1.26-1.63.86.86 0 0 0-.86-.86zM9.5 6a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `line_thickness_20_regular`. */
export const FluentRefStrokeWeightIcon = () => (
  <svg {...base}>
    <path d="M2 4.5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m0 10c0-.83.67-1.5 1.5-1.5h13a1.5 1.5 0 0 1 0 3h-13A1.5 1.5 0 0 1 2 14.5M3 8a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2z" />
  </svg>
);

/** Fluent `line_thickness_20_filled`. */
export const FluentRefStrokeWeightFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 4a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5zM2 9.25C2 8.56 2.56 8 3.25 8h13.5a1.25 1.25 0 1 1 0 2.5H3.25C2.56 10.5 2 9.94 2 9.25m0 5.5c0-.97.78-1.75 1.75-1.75h12.5a1.75 1.75 0 1 1 0 3.5H3.75c-.97 0-1.75-.78-1.75-1.75" />
  </svg>
);

/** Fluent `keyboard_shift_16_regular`. */
export const FluentRefShiftIcon = () => (
  <svg {...base}>
    <path d="M8.4 2.2a.5.5 0 0 0-.8 0L3 8H5.5a.5.5 0 0 1 .5.5V13h4.02V8.5c0-.28.23-.5.5-.5H13zm-1.58-.63c.6-.76 1.76-.76 2.36 0l4.6 5.8A1 1 0 0 1 13 9h-1.97v4A1 1 0 0 1 10 14H5.99a1 1 0 0 1-1-1V9H3a1 1 0 0 1-.8-1.63z" />
  </svg>
);

/** Fluent `keyboard_shift_16_filled`. */
export const FluentRefShiftFilledIcon = () => (
  <svg {...base}>
    <path d="M9.18 1.57a1.5 1.5 0 0 0-2.36 0l-4.6 5.8A1 1 0 0 0 3 9h1.98v4a1 1 0 0 0 1 1.01h4.02a1 1 0 0 0 1-1V9H13a1 1 0 0 0 .8-1.63z" />
  </svg>
);

/** Fluent `text_subscript_16_regular`. */
export const FluentRefSubscriptIcon = () => (
  <svg {...base}>
    <path d="M2.17 3.13a.5.5 0 0 1 .7.04L6.5 7.25l3.63-4.08a.5.5 0 0 1 .74.66L7.17 8l2.85 3.2-.02.3c0 .47.22.9.56 1.17q-.1.15-.18.31a.5.5 0 0 1-.25-.15L6.5 8.75l-3.63 4.08a.5.5 0 1 1-.74-.66L5.83 8l-3.7-4.17a.5.5 0 0 1 .04-.7M12 11.5a.5.5 0 0 1 1 0q-.01.37-.19.5-.14.14-.35.26l-.24.15C11.36 13 11 13.77 11 14.5c0 .28.22.5.5.5h2a.5.5 0 0 0 0-1h-1.4q.16-.39.68-.76l.13-.08c.17-.11.42-.27.6-.45.29-.29.49-.67.49-1.21a1.5 1.5 0 0 0-3 0 .5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `text_subscript_16_filled`. */
export const FluentRefSubscriptFilledIcon = () => (
  <svg {...base}>
    <path d="M2 2.94A.75.75 0 0 1 3.06 3L6.5 6.87 9.94 3a.75.75 0 0 1 1.12 1L7.5 8l2.38 2.67q-.13.4-.13.83.02.73.49 1.21l-.2.39-.1-.1L6.5 9.13 3.06 13a.75.75 0 1 1-1.12-1L5.5 8 1.94 4A.75.75 0 0 1 2 2.94m10.25 8.56a.25.25 0 1 1 .5 0q0 .15-.03.2l-.09.12q-.05.07-.2.16l-.15.1h-.01l-.2.13a2.8 2.8 0 0 0-1.32 2.29c0 .41.34.75.75.75h2a.75.75 0 0 0 0-1.5h-.93a2 2 0 0 1 .45-.37c.18-.1.46-.29.67-.5.33-.32.56-.77.56-1.38a1.75 1.75 0 1 0-3.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `text_superscript_16_regular`. */
export const FluentRefSuperscriptIcon = () => (
  <svg {...base}>
    <path d="M12 2.5a.5.5 0 0 1 1 0c0 .26-.08.4-.19.5q-.14.14-.35.26l-.24.15C11.36 4 11 4.77 11 5.5c0 .28.22.5.5.5h2a.5.5 0 0 0 0-1h-1.4a1.8 1.8 0 0 1 .81-.84c.17-.11.42-.27.6-.45.29-.29.49-.67.49-1.21a1.5 1.5 0 0 0-3 0 .5.5 0 0 0 1 0m-2 2q0-.76.36-1.48a1 1 0 0 0-.23.15L6.5 7.25 2.87 3.17a.5.5 0 0 0-.74.66L5.83 8l-3.7 4.17a.5.5 0 0 0 .74.66L6.5 8.75l3.63 4.08a.5.5 0 1 0 .74-.66L7.17 8l2.86-3.22z" />
  </svg>
);

/** Fluent `text_superscript_16_filled`. */
export const FluentRefSuperscriptFilledIcon = () => (
  <svg {...base}>
    <path d="M12.25 2.5a.25.25 0 1 1 .5 0q0 .15-.03.2l-.09.12q-.05.07-.2.16l-.15.1h-.01l-.2.13a2.8 2.8 0 0 0-1.32 2.29c0 .41.34.75.75.75h2a.75.75 0 0 0 0-1.5h-.93a2 2 0 0 1 .45-.37c.18-.1.46-.29.67-.5.33-.32.56-.77.56-1.38a1.75 1.75 0 1 0-3.5 0 .75.75 0 0 0 1.5 0m-2.01 1.21a3.5 3.5 0 0 0-.49 1.76L7.5 8l3.56 4a.75.75 0 0 1-1.12 1L6.5 9.13 3.06 13a.75.75 0 1 1-1.12-1L5.5 8 1.94 4a.75.75 0 1 1 1.12-1L6.5 6.87 9.85 3.1q.13.35.39.61" />
  </svg>
);

/** Fluent `text_font_size_16_regular`. */
export const FluentRefTextSizeIcon = () => (
  <svg {...base}>
    <path d="M10.5 2c.21 0 .4.13.47.33l4 11a.5.5 0 1 1-.94.34L12.7 10H8.3l-1.33 3.67a.5.5 0 0 1-.93.02L5.34 12H2.66l-.7 1.7a.5.5 0 0 1-.93-.4l2.5-6a.5.5 0 0 1 .92 0l2 4.82 3.57-9.8.03-.06A.5.5 0 0 1 10.5 2m-7.42 9h1.84L4 8.8zm5.59-2h3.66L10.5 3.96z" />
  </svg>
);

/** Fluent `text_font_size_16_filled`. */
export const FluentRefTextSizeFilledIcon = () => (
  <svg {...base}>
    <path d="M10.5 1.75c.32 0 .6.2.7.5l4 11a.75.75 0 0 1-1.4.5L12.6 10.5H8.4L7.2 13.76a.75.75 0 0 1-1.4.03l-.54-1.29H2.73l-.54 1.29a.75.75 0 0 1-1.38-.58l2.5-6 .05-.1a.75.75 0 0 1 1.33.1l1.76 4.23 3.34-9.2c.11-.3.4-.49.71-.49M3.35 11h1.3L4 9.45zm5.58-2h3.14L10.5 4.7z" />
  </svg>
);

/** Fluent `tree_deciduous_20_regular`. */
export const FluentRefTreeIcon = () => (
  <svg {...base}>
    <path d="M10 2a3.5 3.5 0 0 0-3.39 2.61A3.5 3.5 0 0 0 4.05 8.6 3.5 3.5 0 0 0 6 15h2v1.75c0 .69.56 1.25 1.25 1.25h1.5c.69 0 1.25-.56 1.25-1.25V15h2a3.5 3.5 0 0 0 1.95-6.4 3.5 3.5 0 0 0-2.56-3.99A3.5 3.5 0 0 0 10 2m1 13v1.75q-.02.23-.25.25h-1.5a.25.25 0 0 1-.25-.25V15zM7.53 5.11a2.5 2.5 0 0 1 4.94 0c.03.22.2.39.42.42A2.5 2.5 0 0 1 14.9 8.7a.5.5 0 0 0 .25.58A2.5 2.5 0 0 1 14 14H6a2.5 2.5 0 0 1-1.15-4.72.5.5 0 0 0 .25-.58A2.5 2.5 0 0 1 7.1 5.53a.5.5 0 0 0 .42-.42" />
  </svg>
);

/** Fluent `tree_deciduous_20_filled`. */
export const FluentRefTreeFilledIcon = () => (
  <svg {...base}>
    <path d="M10 2a3.5 3.5 0 0 0-3.39 2.61A3.5 3.5 0 0 0 4.05 8.6 3.5 3.5 0 0 0 6 15h2v1.75c0 .69.56 1.25 1.25 1.25h1.5c.69 0 1.25-.56 1.25-1.25V15h2a3.5 3.5 0 0 0 1.95-6.4 3.5 3.5 0 0 0-2.56-3.99A3.5 3.5 0 0 0 10 2M9 15h2v1.75q-.02.23-.25.25h-1.5a.25.25 0 0 1-.25-.25z" />
  </svg>
);

/** Fluent `beaker_16_regular`. */
export const FluentRefFlaskIcon = () => (
  <svg {...base}>
    <path d="M5.5 3H6v3.69q0 .68-.34 1.26l-2.21 3.8A1.5 1.5 0 0 0 4.75 14h6.5a1.5 1.5 0 0 0 1.3-2.26l-2.21-3.8A2.5 2.5 0 0 1 10 6.7V3h.5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0 0 1M7 6.69V3h2v3.69q0 .95.48 1.76L9.8 9H6.2l.32-.55A3.5 3.5 0 0 0 7 6.7M5.62 10h4.76l1.31 2.25a.5.5 0 0 1-.43.75H4.74a.5.5 0 0 1-.43-.75z" />
  </svg>
);

/** Fluent `beaker_16_filled`. */
export const FluentRefFlaskFilledIcon = () => (
  <svg {...base}>
    <path d="M6 3v3.69q0 .68-.34 1.26L5.05 9h5.9l-.6-1.05A2.5 2.5 0 0 1 10 6.69V3h.5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0 0 1zm5.54 7H4.46l-1.01 1.74A1.5 1.5 0 0 0 4.75 14h6.5a1.5 1.5 0 0 0 1.3-2.26z" />
  </svg>
);

/** Fluent `circle_half_fill_16_regular`. */
export const FluentRefContrastIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6" />
  </svg>
);

/** Fluent `circle_half_fill_16_filled`. */
export const FluentRefContrastFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1.5A5.5 5.5 0 0 0 2.5 8h11A5.5 5.5 0 0 0 8 2.5" />
  </svg>
);

/** Fluent `call_end_16_regular`. */
export const FluentRefCallEndIcon = () => (
  <svg {...base}>
    <path d="m14.93 9.38.03-.16c.15-.89-.15-1.8-.82-2.4Q12.14 4.98 8 5 3.87 5 1.86 6.8a2.7 2.7 0 0 0-.79 2.59l.14.57c.22.95 1.1 1.58 2.07 1.48l1.22-.12c.82-.09 1.5-.69 1.68-1.5l.28-1.25.01-.03.07-.03.2-.08Q7.18 8.3 8 8.3q1.12 0 1.47.22.06.05.08.11l.27 1.2c.18.8.86 1.4 1.68 1.49l1.23.12c.96.1 1.84-.54 2.07-1.49zM8 6.06q3.78 0 5.43 1.54c.4.36.58.9.5 1.42l-.02.12-.14.57c-.1.43-.5.72-.94.68l-1.22-.13a.9.9 0 0 1-.77-.68l-.27-1.19q-.12-.5-.56-.77A4 4 0 0 0 8 7.24c-1.4 0-2.26.26-2.52.96l-.03.1-.3 1.28a.9.9 0 0 1-.76.68l-1.22.13a.9.9 0 0 1-.94-.67l-.14-.58a1.6 1.6 0 0 1 .48-1.55Q4.22 6.07 8 6.06" />
  </svg>
);

/** Fluent `call_end_16_filled`. */
export const FluentRefCallEndFilledIcon = () => (
  <svg {...base}>
    <path d="m14.83 9.7.13-.75a2.3 2.3 0 0 0-.7-2.07Q12.18 5 7.82 5 3.46 5 1.59 6.9a2.1 2.1 0 0 0-.5 2.07l.21.75c.2.7.89 1.18 1.6 1.1l1.42-.14c.61-.07 1.1-.52 1.2-1.13l.27-1.6a5.5 5.5 0 0 1 4.36-.14l.45 1.72c.15.61.69 1.07 1.31 1.14l1.43.14c.72.07 1.36-.4 1.49-1.1" />
  </svg>
);

/** Fluent `chat_multiple_16_regular`. */
export const FluentRefChatMultipleIcon = () => (
  <svg {...base}>
    <path d="M13.82 5.43a6 6 0 0 1 .47 6.4l.7 2.54a.5.5 0 0 1-.65.6L12 14.2a6 6 0 0 1-6.57-.37 7 7 0 0 0 2.66.1 5 5 0 0 0 3.58-.7q.2-.1.43-.05l1.67.56-.5-1.83a.5.5 0 0 1 .05-.39 5 5 0 0 0 .6-3.42 7 7 0 0 0-.1-2.66M7 1a6 6 0 1 1-3 11.2l-2.34.77a.5.5 0 0 1-.64-.6l.69-2.54A6 6 0 0 1 7 1m0 1a5 5 0 0 0-4.32 7.51.5.5 0 0 1 .05.39l-.5 1.83 1.67-.56q.22-.06.43.05A5 5 0 1 0 7 2" />
  </svg>
);

/** Fluent `chat_multiple_16_filled`. */
export const FluentRefChatMultipleFilledIcon = () => (
  <svg {...base}>
    <path d="M13.82 5.43a6 6 0 0 1 .47 6.4l.7 2.54a.5.5 0 0 1-.65.6L12 14.2a6 6 0 0 1-6.57-.37 7 7 0 0 0 2.66.1 5 5 0 0 0 3.58-.7q.2-.1.43-.05l1.67.56-.5-1.83a.5.5 0 0 1 .05-.39 5 5 0 0 0 .6-3.42 7 7 0 0 0-.1-2.66M7 1a6 6 0 1 1-3 11.2l-2.34.77a.5.5 0 0 1-.64-.6l.69-2.54A6 6 0 0 1 7 1" />
  </svg>
);

/** Fluent `person_circle_16_regular`. */
export const FluentRefPersonCircleIcon = () => (
  <svg {...base}>
    <path d="M10 8.5c.83 0 1.5.67 1.5 1.5 0 1.25-1 2.5-3.5 2.5S4.5 11.25 4.5 10c0-.83.67-1.5 1.5-1.5zm-2-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `person_circle_16_filled`. */
export const FluentRefPersonCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1M6 8.5c-.83 0-1.5.67-1.5 1.5 0 1.25 1 2.5 3.5 2.5s3.5-1.25 3.5-2.5c0-.83-.67-1.5-1.5-1.5zm2-5a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
  </svg>
);

/** Fluent `emoji_sad_16_regular`. */
export const FluentRefFrownIcon = () => (
  <svg {...base}>
    <path d="M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8m4-1.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m3.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-4.37 4.07a2.53 2.53 0 0 1 3.74 0 .5.5 0 1 0 .76-.64 3.53 3.53 0 0 0-5.26 0 .5.5 0 1 0 .76.64" />
  </svg>
);

/** Fluent `emoji_sad_16_filled`. */
export const FluentRefFrownFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2M6.25 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m3.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m.12 3.32a.5.5 0 1 0 .76-.64 3.53 3.53 0 0 0-5.26 0 .5.5 0 1 0 .76.64 2.53 2.53 0 0 1 3.74 0" />
  </svg>
);

/** Fluent `crown_16_regular`. */
export const FluentRefCrownIcon = () => (
  <svg {...base}>
    <path d="M8 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m2.4-4.28L8.76 3.65a1 1 0 1 0-1.52 0L5.6 5.72a.5.5 0 0 1-.6.14L2.48 4.68l.02-.18a1 1 0 1 0-.91 1l1.3 6.5c.12.58.63 1 1.22 1h7.78c.6 0 1.1-.42 1.22-1l1.3-6.5h.09a1 1 0 1 0-.98-.82L11 5.86a.5.5 0 0 1-.6-.14M8 4.3l1.62 2.04a1.5 1.5 0 0 0 1.81.42l1.88-.88-1.18 5.92a.25.25 0 0 1-.24.2H4.1a.25.25 0 0 1-.24-.2L2.69 5.88l1.88.88c.63.3 1.38.13 1.81-.42z" />
  </svg>
);

/** Fluent `crown_16_filled`. */
export const FluentRefCrownFilledIcon = () => (
  <svg {...base}>
    <path d="M10.4 5.72 8.76 3.65a1 1 0 1 0-1.52 0L5.6 5.72a.5.5 0 0 1-.6.14L2.48 4.68l.02-.18a1 1 0 1 0-.91 1l1.3 6.5c.12.58.63 1 1.22 1h7.78c.6 0 1.1-.42 1.22-1l1.3-6.5h.09a1 1 0 1 0-.98-.82L11 5.86a.5.5 0 0 1-.6-.14M8 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
  </svg>
);

/** Fluent `ribbon_16_regular`. */
export const FluentRefAwardIcon = () => (
  <svg {...base}>
    <path d="M8 1a5 5 0 0 0-3 9v4.5a.5.5 0 0 0 .76.43L8 13.58l2.24 1.35a.5.5 0 0 0 .76-.43V10a5 5 0 0 0-3-9M4 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0m6 4.58v3.04l-1.74-1.05a.5.5 0 0 0-.52 0L6 13.62v-3.04a5 5 0 0 0 4 0" />
  </svg>
);

/** Fluent `ribbon_16_filled`. */
export const FluentRefAwardFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a5 5 0 1 0 0 10A5 5 0 0 0 8 1M5 14.5v-3.3a6 6 0 0 0 6 0v3.3a.5.5 0 0 1-.76.43L8 13.58l-2.24 1.35A.5.5 0 0 1 5 14.5" />
  </svg>
);

/** Fluent `building_bank_16_regular`. */
export const FluentRefBankIcon = () => (
  <svg {...base}>
    <path d="M8 5a.75.75 0 1 0 0-1.5A.75.75 0 0 0 8 5m.74-3.55a1.2 1.2 0 0 0-1.48 0l-5 4.07A.83.83 0 0 0 2.8 7H3v4.2c-.6.3-1 .92-1 1.63v.67c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-.67c0-.7-.4-1.33-1-1.63V7h.21a.83.83 0 0 0 .53-1.48zm-.84.78a.2.2 0 0 1 .2 0L12.75 6H3.26zM12 11h-1V7h1zm-2 0H8.5V7H10zm-2.5 0H6V7h1.5zm4.67 1c.46 0 .83.37.83.83V13H3v-.17c0-.46.37-.83.83-.83zM5 11H4V7h1z" />
  </svg>
);

/** Fluent `building_bank_16_filled`. */
export const FluentRefBankFilledIcon = () => (
  <svg {...base}>
    <path d="M7.3 1.71c.41-.32 1-.32 1.4 0l4.97 3.8c.63.48.3 1.49-.5 1.49H2.83a.83.83 0 0 1-.5-1.5zM8 5.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M3.5 8v3H5V8zM6 8v3h1.5V8zm2.5 0v3H10V8zM11 8v3h1.5V8zm-9 5.25c0-.69.56-1.25 1.25-1.25h9.5c.69 0 1.25.56 1.25 1.25v.25a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `money_16_regular`. */
export const FluentRefBanknoteIcon = () => (
  <svg {...base}>
    <path d="M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zM2.25 4a.25.25 0 0 0-.25.25V5h.5a.5.5 0 0 0 .5-.5V4zM2 9.75c0 .14.11.25.25.25H3v-.5a.5.5 0 0 0-.5-.5H2zm2-.25v.5h6v-.5c0-.83.67-1.5 1.5-1.5h.5V6h-.5A1.5 1.5 0 0 1 10 4.5V4H4v.5C4 5.33 3.33 6 2.5 6H2v2h.5C3.33 8 4 8.67 4 9.5m7 .5h.75q.23-.02.25-.25V9h-.5a.5.5 0 0 0-.5.5zm1-5v-.75a.25.25 0 0 0-.25-.25H11v.5c0 .28.22.5.5.5zm-7.5 8a1.5 1.5 0 0 1-1.43-1.04q.2.04.43.04h8.25C12.99 12 14 11 14 9.75V5.09c.58.2 1 .76 1 1.41v3.25c0 1.8-1.46 3.25-3.25 3.25z" />
  </svg>
);

/** Fluent `money_16_filled`. */
export const FluentRefBanknoteFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zm3 .25V4H3v.5a.5.5 0 0 1-.5.5H2v1h.5C3.33 6 4 5.33 4 4.5M9 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0m2-3h-1v.5c0 .83.67 1.5 1.5 1.5h.5V5h-.5a.5.5 0 0 1-.5-.5zM4 9.5C4 8.67 3.33 8 2.5 8H2v1h.5c.28 0 .5.22.5.5v.5h1zm7 .5v-.5c0-.28.22-.5.5-.5h.5V8h-.5c-.83 0-1.5.67-1.5 1.5v.5zm-6.5 3a1.5 1.5 0 0 1-1.43-1.04q.2.04.43.04h8.25C12.99 12 14 11 14 9.75V5.09c.58.2 1 .76 1 1.41v3.25c0 1.8-1.46 3.25-3.25 3.25z" />
  </svg>
);

/** Fluent `code_block_16_regular`. */
export const FluentRefCodeBlockIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5zm6.85 1.15a.5.5 0 1 0-.7.7L10.79 8 9.15 9.65a.5.5 0 0 0 .7.7l2-2a.5.5 0 0 0 0-.7zm-3 .7a.5.5 0 0 0-.7-.7l-2 2a.5.5 0 0 0 0 .7l2 2a.5.5 0 0 0 .7-.7L5.21 8z" />
  </svg>
);

/** Fluent `code_block_16_filled`. */
export const FluentRefCodeBlockFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm5.35 3.65 2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7-.7L10.79 8 9.15 6.35a.5.5 0 1 1 .7-.7m-3 .7L5.21 8l1.64 1.65a.5.5 0 0 1-.7.7l-2-2a.5.5 0 0 1 0-.7l2-2a.5.5 0 0 1 .7.7" />
  </svg>
);

/** Fluent `library_16_regular`. */
export const FluentRefLibraryIcon = () => (
  <svg {...base}>
    <path d="M1 3.25C1 2.55 1.56 2 2.25 2h.5C3.44 2 4 2.56 4 3.25v9.5c0 .69-.56 1.24-1.25 1.24h-.5C1.55 14 1 13.44 1 12.74zM2.25 3a.25.25 0 0 0-.25.25v9.5c0 .13.11.24.25.24h.5c.14 0 .25-.1.25-.25v-9.5A.25.25 0 0 0 2.75 3zM5 3.25C5 2.55 5.56 2 6.25 2h.5c.68 0 1.24.56 1.24 1.25v9.5c0 .69-.56 1.24-1.24 1.24h-.5C5.55 14 5 13.44 5 12.74zM6.25 3a.25.25 0 0 0-.25.25v9.5c0 .13.1.24.25.24h.5c.13 0 .24-.1.24-.25v-9.5A.25.25 0 0 0 6.75 3zm5.72 1.78a1.25 1.25 0 0 0-1.57-.72l-.58.2c-.67.24-1.01 1-.75 1.65l2.94 7.3c.25.63.94.94 1.57.72l.58-.2c.68-.24 1.02-.99.75-1.65zM10.73 5c.13-.05.27.02.32.14l2.93 7.3a.25.25 0 0 1-.15.33l-.58.2a.25.25 0 0 1-.31-.14L10 5.54a.25.25 0 0 1 .15-.33z" />
  </svg>
);

/** Fluent `library_16_filled`. */
export const FluentRefLibraryFilledIcon = () => (
  <svg {...base}>
    <path d="M2.25 2C1.55 2 1 2.56 1 3.25v9.5c0 .68.56 1.24 1.25 1.24h.5C3.44 14 4 13.43 4 12.74v-9.5C4 2.57 3.44 2 2.75 2zm4 0C5.55 2 5 2.56 5 3.25v9.5c0 .68.56 1.24 1.25 1.24h.5c.69 0 1.24-.56 1.24-1.25v-9.5C8 2.57 7.44 2 6.75 2zm5.72 2.78a1.25 1.25 0 0 0-1.57-.72l-.58.2c-.67.24-1.01 1-.75 1.65l2.94 7.3c.25.63.94.94 1.57.72l.58-.2c.68-.24 1.02-.99.75-1.65z" />
  </svg>
);

/** Fluent `camera_off_16_regular`. */
export const FluentRefCameraOffIcon = () => (
  <svg {...base}>
    <path d="M14.15 14.85q.15.15.35.15a.5.5 0 0 0 .35-.85l-13-13a.5.5 0 0 0-.7.7L3.39 4.1A2 2 0 0 0 2 6v5c0 1.11.9 2 2 2h8l.27-.01zM11.29 12H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.3l1.25 1.26a3 3 0 0 0 4.18 4.18zM6.28 6.98l2.74 2.74Q8.56 10 8 10a2 2 0 0 1-1.72-3.02M12 4h-.7l-.58-1.17A1.5 1.5 0 0 0 9.38 2H6.62a1.5 1.5 0 0 0-1.34.83l-.11.22.74.74.26-.51A.5.5 0 0 1 6.62 3h2.76q.31 0 .45.28l.72 1.44A.5.5 0 0 0 11 5h1a1 1 0 0 1 1 1v4.88l.86.85A2 2 0 0 0 14 11V6a2 2 0 0 0-2-2M10.9 8.77q.1-.37.1-.77a3 3 0 0 0-3.76-2.9l.9.91c1 .07 1.79.86 1.86 1.85z" />
  </svg>
);

/** Fluent `camera_off_16_filled`. */
export const FluentRefCameraOffFilledIcon = () => (
  <svg {...base}>
    <path d="m1.85 1.15 13 13a.5.5 0 0 1-.7.7l-1.89-1.88L12 13H4a2 2 0 0 1-2-2V6a2 2 0 0 1 1.4-1.9L1.15 1.85a.5.5 0 0 1 .7-.7M5 8a3 3 0 0 0 4.73 2.44l-.72-.72Q8.56 9.99 8 10a2 2 0 0 1-1.72-3.01l-.72-.72A3 3 0 0 0 5 8m3-3a3 3 0 0 1 2.89 3.77l2.97 2.96A2 2 0 0 0 14 11V6a2 2 0 0 0-2-2h-.7l-.58-1.17A1.5 1.5 0 0 0 9.38 2H6.62a1.5 1.5 0 0 0-1.34.83l-.11.22L7.23 5.1Q7.6 5.01 8 5m1.99 2.86c-.07-1-.86-1.78-1.85-1.85z" />
  </svg>
);

/** Fluent `closed_caption_16_regular`. */
export const FluentRefCaptionsIcon = () => (
  <svg {...base}>
    <path d="M9.18 5.7a1.8 1.8 0 0 1 2.07.35.5.5 0 0 1-.7.7.8.8 0 0 0-.93-.15C9.34 6.74 9 7.14 9 8s.34 1.26.62 1.4c.3.15.68.1.93-.15a.5.5 0 0 1 .7.7 1.8 1.8 0 0 1-2.07.35C8.46 9.94 8 9.14 8 8s.46-1.94 1.18-2.3m-1.93.35a1.8 1.8 0 0 0-2.07-.35C4.46 6.06 4 6.86 4 8s.46 1.94 1.18 2.3c.7.35 1.52.2 2.07-.35a.5.5 0 1 0-.7-.7.8.8 0 0 1-.93.15C5.34 9.26 5 8.86 5 8s.34-1.26.62-1.4a.8.8 0 0 1 .93.15.5.5 0 0 0 .7-.7M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM3.5 4C2.67 4 2 4.67 2 5.5v5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `closed_caption_16_filled`. */
export const FluentRefCaptionsFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 3A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 12.5 3zm5.68 2.7a1.8 1.8 0 0 1 2.07.35.5.5 0 0 1-.7.7.8.8 0 0 0-.93-.15C9.34 6.74 9 7.14 9 8s.34 1.26.62 1.4c.3.15.68.1.93-.15a.5.5 0 0 1 .7.7 1.8 1.8 0 0 1-2.07.35C8.46 9.94 8 9.14 8 8s.46-1.94 1.18-2.3m-1.93.35a.5.5 0 0 1-.7.7.8.8 0 0 0-.93-.15C5.34 6.74 5 7.14 5 8s.34 1.26.62 1.4c.3.15.68.1.93-.15a.5.5 0 1 1 .7.7 1.8 1.8 0 0 1-2.07.35C4.46 9.94 4 9.14 4 8s.46-1.94 1.18-2.3a1.8 1.8 0 0 1 2.07.35" />
  </svg>
);

/** Fluent `image_multiple_16_regular`. */
export const FluentRefImagesIcon = () => (
  <svg {...base}>
    <path d="M10 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M4.5 2A2.5 2.5 0 0 0 2 4.5v5A2.5 2.5 0 0 0 4.5 12h5A2.5 2.5 0 0 0 12 9.5v-5A2.5 2.5 0 0 0 9.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h5c.83 0 1.5.67 1.5 1.5v5q0 .35-.15.65L8.21 7.5a1.7 1.7 0 0 0-2.42 0l-2.64 2.65A2 2 0 0 1 3 9.5zm.85 6.35L6.5 8.21a.7.7 0 0 1 1 0l2.65 2.64q-.3.15-.65.15h-5a2 2 0 0 1-.65-.15M7 14a2.5 2.5 0 0 1-2-1h4.5A3.5 3.5 0 0 0 13 9.5V4c.6.46 1 1.18 1 2v3.5A4.5 4.5 0 0 1 9.5 14z" />
  </svg>
);

/** Fluent `image_multiple_16_filled`. */
export const FluentRefImagesFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v5q.01.77.41 1.38L5.8 7.5a1.7 1.7 0 0 1 2.42 0l3.38 3.38q.4-.6.41-1.38v-5A2.5 2.5 0 0 0 9.5 2zM10 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m.88 6.59L7.5 8.2a.7.7 0 0 0-1 0l-3.38 3.38q.6.4 1.38.41h5q.77-.01 1.38-.41M5 13c.46.6 1.18 1 2 1h2.5A4.5 4.5 0 0 0 14 9.5V6c0-.82-.4-1.54-1-2v5.5A3.5 3.5 0 0 1 9.5 13z" />
  </svg>
);

/** Fluent `picture_in_picture_16_regular`. */
export const FluentRefPictureInPictureIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h8A2.5 2.5 0 0 1 14 4.5V8h-1V4.5c0-.83-.67-1.5-1.5-1.5h-8C2.67 3 2 3.67 2 4.5v5c0 .83.67 1.5 1.5 1.5H7v1H3.5A2.5 2.5 0 0 1 1 9.5zM9 9a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `picture_in_picture_16_filled`. */
export const FluentRefPictureInPictureFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2A2.5 2.5 0 0 0 1 4.5v5A2.5 2.5 0 0 0 3.5 12H7v-2c0-1.1.9-2 2-2h5V4.5A2.5 2.5 0 0 0 11.5 2zM8 10a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `share_screen_start_16_regular`. */
export const FluentRefScreenShareIcon = () => (
  <svg {...base}>
    <path d="M2.75 3C1.78 3 1 3.78 1 4.75v6.5c0 .97.78 1.75 1.75 1.75h10.5c.97 0 1.75-.78 1.75-1.75v-6.5C15 3.78 14.22 3 13.25 3zM2 4.75c0-.41.34-.75.75-.75h10.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75H2.75a.75.75 0 0 1-.75-.75zm6.35.4a.5.5 0 0 0-.7 0l-2 2a.5.5 0 1 0 .7.7L7.5 6.71v3.79a.5.5 0 0 0 1 0V6.7l1.15 1.15a.5.5 0 0 0 .7-.7z" />
  </svg>
);

/** Fluent `share_screen_start_16_filled`. */
export const FluentRefScreenShareFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 3C1.78 3 1 3.78 1 4.75v6.5c0 .97.78 1.75 1.75 1.75h10.5c.97 0 1.75-.78 1.75-1.75v-6.5C15 3.78 14.22 3 13.25 3zm5.6 2.15 2 2a.5.5 0 0 1-.7.7L8.5 6.71v3.79a.5.5 0 0 1-1 0V6.7L6.35 7.86a.5.5 0 1 1-.7-.7l2-2c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `fast_forward_16_regular`. */
export const FluentRefFastForwardIcon = () => (
  <svg {...base}>
    <path d="M2 4.46a1 1 0 0 1 1.58-.81L8 6.77v-2.3a1 1 0 0 1 1.58-.82l5 3.53a1 1 0 0 1 0 1.64l-5 3.53A1 1 0 0 1 8 11.54v-2.3l-4.42 3.11A1 1 0 0 1 2 11.54zM8 8 3 4.46v7.08L8 8zm1 3.55L14.01 8 9 4.46z" />
  </svg>
);

/** Fluent `fast_forward_16_filled`. */
export const FluentRefFastForwardFilledIcon = () => (
  <svg {...base}>
    <path d="M8 4.46a1 1 0 0 1 1.58-.81l5 3.53a1 1 0 0 1 0 1.64l-5 3.53A1 1 0 0 1 8 11.54v-2.3l-4.42 3.11A1 1 0 0 1 2 11.54V4.46a1 1 0 0 1 1.58-.81L8 6.77z" />
  </svg>
);

/** Fluent `braces_variable_20_regular`. */
export const FluentRefVariableIcon = () => (
  <svg {...base}>
    <path d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.88c0 .5-.28.95-.72 1.17a.5.5 0 0 0 0 .9c.44.22.72.68.72 1.17v2.88A2.5 2.5 0 0 0 5.5 17a.5.5 0 0 0 0-1A1.5 1.5 0 0 1 4 14.5v-2.88c0-.62-.24-1.2-.66-1.62.42-.42.66-1 .66-1.62V5.5C4 4.67 4.67 4 5.5 4a.5.5 0 0 0 0-1m9 0A2.5 2.5 0 0 1 17 5.5v2.88c0 .5.28.95.72 1.17a.5.5 0 0 1 0 .9 1.3 1.3 0 0 0-.72 1.17v2.88a2.5 2.5 0 0 1-2.5 2.5.5.5 0 0 1 0-1c.83 0 1.5-.67 1.5-1.5v-2.88c0-.62.24-1.2.66-1.62A2.3 2.3 0 0 1 16 8.38V5.5c0-.83-.67-1.5-1.5-1.5a.5.5 0 0 1 0-1M7.9 6.2a.5.5 0 0 0-.8.6L9.38 10l-2.3 3.2a.5.5 0 0 0 .82.6L10 10.85l2.1 2.93a.5.5 0 0 0 .8-.58L10.62 10l2.3-3.2a.5.5 0 1 0-.82-.6L10 9.15z" />
  </svg>
);

/** Fluent `braces_variable_20_filled`. */
export const FluentRefVariableFilledIcon = () => (
  <svg {...base}>
    <path d="M5.75 2.5A2.75 2.75 0 0 0 3 5.25v3.13c0 .4-.22.76-.57.94a.75.75 0 0 0 0 1.36c.35.18.57.54.57.94v3.13a2.75 2.75 0 0 0 2.75 2.75.75.75 0 0 0 0-1.5c-.69 0-1.25-.56-1.25-1.25v-3.13c0-.6-.21-1.17-.58-1.62.37-.45.58-1.02.58-1.62V5.25C4.5 4.56 5.06 4 5.75 4a.75.75 0 0 0 0-1.5m8.5 0A2.75 2.75 0 0 1 17 5.25v3.13c0 .4.22.76.57.94a.75.75 0 0 1 0 1.36c-.35.18-.57.54-.57.94v3.13a2.75 2.75 0 0 1-2.75 2.75.75.75 0 0 1 0-1.5c.69 0 1.25-.56 1.25-1.25v-3.13c0-.6.21-1.17.58-1.62a2.6 2.6 0 0 1-.58-1.62V5.25c0-.69-.56-1.25-1.25-1.25a.75.75 0 0 1 0-1.5M8.11 6.06a.75.75 0 1 0-1.22.88L9.08 10l-2.19 3.06a.75.75 0 0 0 1.22.88L10 11.29l1.89 2.65a.75.75 0 0 0 1.22-.88L10.92 10l2.19-3.06a.75.75 0 0 0-1.22-.88L10 8.71z" />
  </svg>
);

/** Fluent `braces_16_regular`. */
export const FluentRefBracesIcon = () => (
  <svg {...base}>
    <path d="M5 2a2 2 0 0 0-2 2v2c0 .53 0 .8-.09 1-.06.16-.2.33-.63.55a.5.5 0 0 0 0 .9c.44.22.57.4.63.55.08.2.09.47.09 1v2c0 1.1.9 2 2 2a.5.5 0 0 0 0-1 1 1 0 0 1-1-1V9.94c0-.45 0-.91-.16-1.31Q3.69 8.26 3.4 8q.3-.26.44-.63c.16-.4.16-.86.16-1.3V4a1 1 0 0 1 1-1 .5.5 0 0 0 0-1m6 0a2 2 0 0 1 2 2v2c0 .53 0 .8.09 1 .06.16.2.33.63.55a.5.5 0 0 1 0 .9c-.44.22-.57.4-.63.55-.08.2-.09.47-.09 1v2a2 2 0 0 1-2 2 .5.5 0 0 1 0-1 1 1 0 0 0 1-1V9.94c0-.45 0-.91.16-1.31q.14-.37.44-.63-.3-.26-.44-.63c-.16-.4-.16-.86-.16-1.3V4a1 1 0 0 0-1-1 .5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `braces_16_filled`. */
export const FluentRefBracesFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 2C3.51 2 2.5 3 2.5 4.25V6c0 .55-.01.76-.07.9-.03.09-.1.22-.52.43a.75.75 0 0 0 0 1.34c.41.2.49.34.52.42.06.15.07.36.07.91v1.75c0 1.24 1 2.25 2.25 2.25a.75.75 0 0 0 0-1.5.75.75 0 0 1-.75-.75V9.93c0-.44 0-.95-.18-1.4A2 2 0 0 0 3.5 8q.2-.23.32-.53C4 7.02 4 6.5 4 6.07V4.26c0-.41.34-.75.75-.75a.75.75 0 0 0 0-1.5m6.5 0c1.24 0 2.25 1 2.25 2.25V6c0 .55.01.76.07.9.03.09.1.22.52.43a.75.75 0 0 1 0 1.34c-.41.2-.49.34-.52.42-.06.15-.07.36-.07.91v1.75c0 1.24-1 2.25-2.25 2.25a.75.75 0 0 1 0-1.5c.41 0 .75-.34.75-.75V9.93c0-.44 0-.95.18-1.4q.12-.3.32-.53a2 2 0 0 1-.32-.53 4 4 0 0 1-.18-1.4V4.26a.75.75 0 0 0-.75-.75.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `shape_exclude_16_regular`. */
export const FluentRefBooleanExcludeIcon = () => (
  <svg {...base}>
    <path d="M2 4c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1H4a2 2 0 0 1-2-2zm1 2.56v1.58L8.14 3H6.56zM5.14 3H4a1 1 0 0 0-1 1v1.14zm4.31.1L7.55 5H9.3l.71-.7V4a1 1 0 0 0-.55-.9M5 7.57 3.1 9.45A1 1 0 0 0 4 10h.3l.7-.7zM11.7 13h.3a1 1 0 0 0 1-1v-.3zm1.3-2.7V8.7L8.7 13h1.6zm0-3V7a1 1 0 0 0-.45-.84L11 7.71V9q0 .15-.03.32zm-3.68 3.67Q9.17 11 9 11H7.7l-1.54 1.55A1 1 0 0 0 7 13h.3zM6 7v3h3a1 1 0 0 0 1-1V6H7a1 1 0 0 0-1 1" />
  </svg>
);

/** Fluent `shape_exclude_16_filled`. */
export const FluentRefBooleanExcludeFilledIcon = () => (
  <svg {...base}>
    <path d="M3 2.27A2 2 0 0 0 2 4v5c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2H4a2 2 0 0 0-1 .27M11 5v4a2 2 0 0 1-2 2H5V7c0-1.1.9-2 2-2z" />
  </svg>
);

/** Fluent `shape_intersect_16_regular`. */
export const FluentRefBooleanIntersectIcon = () => (
  <svg {...base}>
    <path d="M2 4c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1H4a2 2 0 0 1-2-2zm8 0a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1V7c0-1.1.9-2 2-2h3zM6 9.7v.3h1.3L10 7.3V6h-.3zM8.3 6H7a1 1 0 0 0-1 1v1.3zM11 9a2 2 0 0 1-1.68 1.97Q9.17 11 9 11H6v1a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1zm-2.3 1H9a1 1 0 0 0 1-1v-.3z" />
  </svg>
);

/** Fluent `shape_intersect_16_filled`. */
export const FluentRefBooleanIntersectFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1H4a2 2 0 0 1-2-2zm8 0a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1V7c0-1.1.9-2 2-2h3zm-4 7v1a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1v3a2 2 0 0 1-2 2z" />
  </svg>
);

/** Fluent `shape_subtract_16_regular`. */
export const FluentRefBooleanSubtractIcon = () => (
  <svg {...base}>
    <path d="M4 2a2 2 0 0 0-2 2v5a2 2 0 0 0 .38 1.18A2 2 0 0 0 4 11h1v1c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2zm1.14 1L3 5.14V4a1 1 0 0 1 1-1zM3 6.56 6.56 3h1.58L3 8.14zM9.45 3.1A1 1 0 0 1 10 4v.3l-.7.7H7.55zM5 7.56v1.73l-.7.71H4a1 1 0 0 1-.9-.55zM6 7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `shape_subtract_16_filled`. */
export const FluentRefBooleanSubtractFilledIcon = () => (
  <svg {...base}>
    <path d="M3 2.27A2 2 0 0 0 2 4v5a2 2 0 0 0 .38 1.18A2 2 0 0 0 4 11h1v1c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2H4a2 2 0 0 0-1 .27M6 7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `shape_union_16_regular`. */
export const FluentRefBooleanUnionIcon = () => (
  <svg {...base}>
    <path d="M4 2a2 2 0 0 0-2 2v5c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2zm1.14 1L3 5.14V4a1 1 0 0 1 1-1zM3 6.56 6.56 3h1.58L3 8.14zM9.45 3.1A1 1 0 0 1 10 4v.3L4.3 10H4a1 1 0 0 1-.9-.55zM10 5.7V6h1.3L6 11.3V10h-.3zm-3.84 6.84 6.39-6.39A1 1 0 0 1 13 7v.3L7.3 13H7a1 1 0 0 1-.84-.45M13 8.7v1.58L10.3 13H8.7zm0 3V12a1 1 0 0 1-1 1h-.3z" />
  </svg>
);

/** Fluent `shape_union_16_filled`. */
export const FluentRefBooleanUnionFilledIcon = () => (
  <svg {...base}>
    <path d="M4 2a2 2 0 0 0-2 2v5c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2z" />
  </svg>
);

/** Fluent `diamond_16_regular`. */
export const FluentRefDiamondIcon = () => (
  <svg {...base}>
    <path d="M6.23 1.23a2.5 2.5 0 0 1 3.54 0l5 5a2.5 2.5 0 0 1 0 3.54l-5 5a2.5 2.5 0 0 1-3.54 0l-5-5a2.5 2.5 0 0 1 0-3.54zm2.83.7a1.5 1.5 0 0 0-2.12 0l-5 5a1.5 1.5 0 0 0 0 2.13l5 5a1.5 1.5 0 0 0 2.12 0l5-5a1.5 1.5 0 0 0 0-2.12z" />
  </svg>
);

/** Fluent `diamond_16_filled`. */
export const FluentRefDiamondFilledIcon = () => (
  <svg {...base}>
    <path d="M6.23 1.23a2.5 2.5 0 0 1 3.54 0l5 5a2.5 2.5 0 0 1 0 3.54l-5 5a2.5 2.5 0 0 1-3.54 0l-5-5a2.5 2.5 0 0 1 0-3.54z" />
  </svg>
);

/** Fluent `triangle_16_regular`. */
export const FluentRefPolygonIcon = () => (
  <svg {...base}>
    <path d="M6.69 1.78a1.5 1.5 0 0 1 2.63 0l5.5 10A1.5 1.5 0 0 1 13.5 14h-11a1.5 1.5 0 0 1-1.31-2.22zm1.75.48a.5.5 0 0 0-.88 0l-5.5 10a.5.5 0 0 0 .44.74h11a.5.5 0 0 0 .44-.74z" />
  </svg>
);

/** Fluent `triangle_16_filled`. */
export const FluentRefPolygonFilledIcon = () => (
  <svg {...base}>
    <path d="M6.69 1.78a1.5 1.5 0 0 1 2.63 0l5.5 10A1.5 1.5 0 0 1 13.5 14h-11a1.5 1.5 0 0 1-1.31-2.22z" />
  </svg>
);

/** Fluent `record_16_regular`. */
export const FluentRefRecordIcon = () => (
  <svg {...base}>
    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8" />
  </svg>
);

/** Fluent `record_16_filled`. */
export const FluentRefRecordFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m7 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
  </svg>
);

/** Fluent `wand_16_regular`. */
export const FluentRefWandIcon = () => (
  <svg {...base}>
    <path d="M13.5 1c.28 0 .5.22.5.5V2h.5a.5.5 0 0 1 0 1H14v.5a.5.5 0 0 1-1 0V3h-.5a.5.5 0 0 1 0-1h.5v-.5c0-.28.22-.5.5-.5m-10 2c.28 0 .5.22.5.5V4h.5a.5.5 0 1 1 0 1H4v.5a.5.5 0 1 1-1 0V5h-.5a.5.5 0 0 1 0-1H3v-.5c0-.28.22-.5.5-.5m9 9a.5.5 0 0 0 0-1H12v-.5a.5.5 0 0 0-1 0v.5h-.5a.5.5 0 0 0 0 1h.5v.5a.5.5 0 0 0 1 0V12zM8.73 4.56a1.91 1.91 0 0 1 2.7 2.71l-7.16 7.17a1.91 1.91 0 0 1-2.71-2.7zm-.48 1.9-5.98 5.98a.91.91 0 0 0 1.29 1.3l5.98-5.99zm2 .58.48-.48a.91.91 0 1 0-1.3-1.29l-.47.48z" />
  </svg>
);

/** Fluent `wand_16_filled`. */
export const FluentRefWandFilledIcon = () => (
  <svg {...base}>
    <path d="M14 1.5a.5.5 0 0 0-1 0V2h-.5a.5.5 0 0 0 0 1h.5v.5a.5.5 0 0 0 1 0V3h.5a.5.5 0 0 0 0-1H14zm-10 2a.5.5 0 0 0-1 0V4h-.5a.5.5 0 0 0 0 1H3v.5a.5.5 0 0 0 1 0V5h.5a.5.5 0 0 0 0-1H4zm9 8a.5.5 0 0 1-.5.5H12v.5a.5.5 0 0 1-1 0V12h-.5a.5.5 0 0 1 0-1h.5v-.5a.5.5 0 0 1 1 0v.5h.5c.28 0 .5.22.5.5M8.73 4.56a1.91 1.91 0 0 1 2.7 2.71l-.47.48-2.71-2.7zM7.54 5.75l2.71 2.7-5.98 5.99a1.91 1.91 0 0 1-2.71-2.7z" />
  </svg>
);

/** Fluent `weather_partly_cloudy_day_16_regular`. */
export const FluentRefCloudSunIcon = () => (
  <svg {...base}>
    <path d="M9 7a2.5 2.5 0 0 0-2.5 2.5v.5h-1a1.5 1.5 0 0 0 0 3h7a1.5 1.5 0 0 0 0-3h-1v-.5A2.5 2.5 0 0 0 9 7M5.53 9a3.5 3.5 0 0 1 6.93 0h.04a2.5 2.5 0 0 1 0 5h-7a2.5 2.5 0 0 1 0-5zM8.8 2.82a.5.5 0 1 0-.89-.47l-.42.8a.5.5 0 0 0 .88.47zM5 2.07a.5.5 0 1 0-.95.3l.26.87a.5.5 0 0 0 .96-.3zM6 4a3 3 0 0 1 2.29 1.06q-.6.1-1.11.32a2 2 0 0 0-2.8 2.8q-.48.15-.9.46A3 3 0 0 1 6 4m-4.18.21a.5.5 0 1 0-.47.89l.8.42a.5.5 0 0 0 .47-.88zm.42 4.47a.5.5 0 0 0-.3-.96L1.07 8a.5.5 0 1 0 .3.95z" />
  </svg>
);

/** Fluent `weather_partly_cloudy_day_16_filled`. */
export const FluentRefCloudSunFilledIcon = () => (
  <svg {...base}>
    <path d="M9 6a3.5 3.5 0 0 0-3.47 3H5.5a2.5 2.5 0 0 0 0 5h7a2.5 2.5 0 0 0 0-5h-.04A3.5 3.5 0 0 0 9 6m-.21-3.18a.5.5 0 1 0-.89-.47l-.42.8a.5.5 0 0 0 .88.47zM5 2.07a.5.5 0 1 0-.95.3l.26.87a.5.5 0 0 0 .96-.3zM3 7q.01.92.49 1.64.54-.4 1.24-.55a4.5 4.5 0 0 1 3.56-3.03A3 3 0 0 0 3 7M1.82 4.21a.5.5 0 1 0-.47.89l.8.42a.5.5 0 0 0 .47-.88zm.42 4.47a.5.5 0 0 0-.3-.96L1.07 8a.5.5 0 1 0 .3.95z" />
  </svg>
);

/** Fluent `arrow_up_right_16_regular`. */
export const FluentRefArrowUpRightIcon = () => (
  <svg {...base}>
    <path d="M7.5 3a.5.5 0 0 1 0-1h6c.28 0 .5.22.5.5v6a.5.5 0 0 1-1 0V3.7L2.85 13.86a.5.5 0 0 1-.7-.7L12.29 3z" />
  </svg>
);

/** Fluent `arrow_up_right_16_filled`. */
export const FluentRefArrowUpRightFilledIcon = () => (
  <svg {...base}>
    <path d="M7 2.75c0-.41.34-.75.75-.75h5.5c.41 0 .75.34.75.75v5.5a.75.75 0 0 1-1.5 0V4.56l-9.22 9.22a.75.75 0 0 1-1.06-1.06l9.22-9.22H7.75A.75.75 0 0 1 7 2.75" />
  </svg>
);

/** Fluent `weather_rain_20_regular`. */
export const FluentRefCloudRainIcon = () => (
  <svg {...base}>
    <path d="M10 4c2.46 0 3.86 1.57 4.07 3.47h.06A2.8 2.8 0 0 1 17 10.24 2.8 2.8 0 0 1 14.13 13h-.7l-.02.03-1.48 2.7a.5.5 0 0 1-.91-.39l.03-.08L12.3 13h-1.85l-.02.03-1.48 2.7a.5.5 0 0 1-.91-.39l.03-.08L9.3 13H7.43l-1.49 2.74a.5.5 0 0 1-.6.23l-.08-.03a.5.5 0 0 1-.23-.6l.03-.08L6.3 13h-.42A2.8 2.8 0 0 1 3 10.24c0-1.47 1.2-2.67 2.7-2.76h.23C6.13 5.55 7.53 4 10 4m0 1a3.04 3.04 0 0 0-3.09 3.02c0 .28-.25.5-.54.5h-.55c-1 0-1.82.78-1.82 1.74S4.81 12 5.82 12h8.36c1 0 1.82-.78 1.82-1.74s-.81-1.74-1.82-1.74h-.55c-.29 0-.54-.22-.54-.5A3 3 0 0 0 10 5" />
  </svg>
);

/** Fluent `weather_rain_20_filled`. */
export const FluentRefCloudRainFilledIcon = () => (
  <svg {...base}>
    <path d="M10.02 4.02c2.46 0 3.86 1.57 4.06 3.47h.06a2.8 2.8 0 0 1 2.88 2.76 2.8 2.8 0 0 1-2.88 2.77h-.71l-.01.02-1.49 2.7a.5.5 0 0 1-.91-.39l.04-.08 1.23-2.25h-1.85l-.01.02-1.49 2.7a.5.5 0 0 1-.9-.39l.03-.08 1.23-2.25H7.43l-1.48 2.73a.5.5 0 0 1-.6.23l-.08-.03a.5.5 0 0 1-.24-.6l.04-.08 1.22-2.25h-.4a2.8 2.8 0 0 1-2.87-2.77c0-1.46 1.19-2.67 2.7-2.75h.23c.2-1.92 1.6-3.48 4.07-3.48" />
  </svg>
);

/** Fluent `weather_thunderstorm_20_regular`. */
export const FluentRefCloudLightningIcon = () => (
  <svg {...base}>
    <path d="m9.13 14.17 1.77-2a.5.5 0 0 1 .8.6l-.06.07L10.62 14h1.88c.4 0 .62.42.44.75l-.05.06-2.44 3a.5.5 0 0 1-.84-.54l.05-.08 1.8-2.19H9.5a.5.5 0 0 1-.42-.76zl1.77-2zM11 6c2.46 0 3.86 1.57 4.07 3.47h.06A2.8 2.8 0 0 1 18 12.24 2.8 2.8 0 0 1 15.13 15h-1.26a1 1 0 0 0 .01-1h1.3c1 0 1.82-.78 1.82-1.74s-.81-1.74-1.82-1.74h-.55c-.29 0-.54-.22-.54-.5A3 3 0 0 0 11 7a3.04 3.04 0 0 0-3.09 3.02c0 .28-.25.5-.54.5h-.55c-1 0-1.82.78-1.82 1.74S5.81 14 6.82 14h1.3a1 1 0 0 0 0 1H6.88A2.8 2.8 0 0 1 4 12.24a2.8 2.8 0 0 1 2.87-2.77h.06C7.13 7.57 8.53 6 11 6M8.4 3c1.45 0 2.72.83 3.34 2.04a6 6 0 0 0-1.28-.02 2.65 2.65 0 0 0-4.7 1.2l-.04.22a1 1 0 0 1-.99.82h-.26c-.81 0-1.47.67-1.47 1.5 0 .57.31 1.06.78 1.31q-.33.42-.52.9a2.62 2.62 0 0 1 1.2-4.85h.22A3.8 3.8 0 0 1 8.39 3" />
  </svg>
);

/** Fluent `weather_thunderstorm_20_filled`. */
export const FluentRefCloudLightningFilledIcon = () => (
  <svg {...base}>
    <path d="M11.61 12.13c.2.18.22.5.04.7L10.62 14h1.88a.5.5 0 0 1 .4.81l-2.46 3a.5.5 0 0 1-.78-.62l1.8-2.19H9.5a.5.5 0 0 1-.37-.83l1.78-2a.5.5 0 0 1 .7-.04M11 6c2.46 0 3.86 1.57 4.07 3.47h.06A2.8 2.8 0 0 1 18 12.24 2.8 2.8 0 0 1 15.13 15h-1.21a1.5 1.5 0 0 0-1.15-1.97l-.13-.02a1.5 1.5 0 0 0-2.56-1.4l-1.7 1.89c-.4.45-.47 1.02-.3 1.5h-1.2A2.8 2.8 0 0 1 4 12.24a2.8 2.8 0 0 1 2.87-2.77h.06C7.13 7.57 8.53 6 11 6M8.4 3c1.45 0 2.72.83 3.34 2.04A6 6 0 0 0 11 5C8.6 5 6.87 6.3 6.25 8.29l-.07.21-.04.19-.17.03a3.7 3.7 0 0 0-2.71 2.26 2.62 2.62 0 0 1 1.2-4.86h.22A3.8 3.8 0 0 1 8.39 3" />
  </svg>
);

/** Fluent `weather_squalls_20_regular`. */
export const FluentRefWindIcon = () => (
  <svg {...base}>
    <path d="M6.57 6.11A3.25 3.25 0 1 1 9.75 10H2.5a.5.5 0 1 1 0-1h7.25a2.25 2.25 0 1 0-2.2-2.7l-.06.3a.5.5 0 1 1-.98-.2zM13 10.5a2.5 2.5 0 1 1 2.5 2.5h-1.38q.37.55.38 1.25a2.25 2.25 0 0 1-4.49.36v-.03a.5.5 0 1 1 .98-.16v.03c.1.6.64 1.05 1.25 1.05a1.25 1.25 0 1 0 0-2.5H2.51a.5.5 0 0 1 0-1h13a1.5 1.5 0 1 0-1.5-1.5.5.5 0 0 1-1 0" />
  </svg>
);

/** Fluent `weather_squalls_20_filled`. */
export const FluentRefWindFilledIcon = () => (
  <svg {...base}>
    <path d="M6.07 5.81A3.5 3.5 0 1 1 9.5 10H2.75a.75.75 0 1 1 0-1.5H9.5a2 2 0 1 0-1.96-2.4l-.05.3A.75.75 0 0 1 6 6.1zm7.29 3.54a2.45 2.45 0 0 1 4.64 1.1v.05a2.5 2.5 0 0 1-2.5 2.5h-.92a2.37 2.37 0 0 1-2.2 3.25c-.8 0-1.55-.4-1.99-1.06l-.01-.02a.75.75 0 1 1 1.24-.83l.02.02a.88.88 0 0 0 1.61-.48c0-.49-.4-.88-.87-.88H2.75a.75.75 0 0 1 0-1.5H15.5a1 1 0 0 0 1-1v-.05a.95.95 0 0 0-1.8-.43l-.03.07a.75.75 0 1 1-1.34-.68z" />
  </svg>
);

/** Fluent `star_off_16_regular`. */
export const FluentRefStarOffIcon = () => (
  <svg {...base}>
    <path d="M12.36 13.07a.9.9 0 0 1-1.32.88L8 12.35l-3.04 1.6a.9.9 0 0 1-1.3-.95l.57-3.39-2.46-2.4a.9.9 0 0 1 .5-1.53l2.36-.34-3.48-3.49a.5.5 0 1 1 .7-.7l13 13a.5.5 0 0 1-.7.7zm-1.22-1.23L5.5 6.22l-2.9.42 2.36 2.3c.21.2.3.5.26.79l-.56 3.24 2.91-1.53a.9.9 0 0 1 .84 0l2.9 1.53zm2.25-5.2-2.35 2.28.74.73-.01-.04 2.46-2.4a.9.9 0 0 0-.5-1.53l-3.4-.5L8.8 2.1a.9.9 0 0 0-1.62 0l-.98 2 .75.74L8 2.73l1.46 2.94a.9.9 0 0 0 .67.5z" />
  </svg>
);

/** Fluent `star_off_16_filled`. */
export const FluentRefStarOffFilledIcon = () => (
  <svg {...base}>
    <path d="m12.36 13.07 1.79 1.78a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7l3.48 3.49-2.36.34a.9.9 0 0 0-.5 1.53l2.46 2.4L3.65 13a.9.9 0 0 0 1.3.95L8 12.35l3.04 1.6a.9.9 0 0 0 1.32-.88m-.6-3.46.02.04L6.2 4.1 7.2 2.1a.9.9 0 0 1 1.62 0l1.52 3.08 3.4.5a.9.9 0 0 1 .5 1.53z" />
  </svg>
);

/** Fluent `qr_code_20_regular`. */
export const FluentRefQrCodeIcon = () => (
  <svg {...base}>
    <path d="M11 15h2v2h-2zm4 0h2v2h-2zm-4-4h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zM3 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm0 1h2v2H5zm-2 8c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1zm0 1h2v2H5zm6-8c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm0 1h2v2h-2z" />
  </svg>
);

/** Fluent `qr_code_20_filled`. */
export const FluentRefQrCodeFilledIcon = () => (
  <svg {...base}>
    <path d="M13 11h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2h2v-2h-2v2h-2zM5 5h2v2H5zm0-2a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-.75 1.75c0-.28.22-.5.5-.5h2.5c.28 0 .5.22.5.5v2.5a.5.5 0 0 1-.5.5h-2.5a.5.5 0 0 1-.5-.5zM5 13h2v2H5zm0-2a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm-.75 1.75c0-.28.22-.5.5-.5h2.5c.28 0 .5.22.5.5v2.5a.5.5 0 0 1-.5.5h-2.5a.5.5 0 0 1-.5-.5zM13 5h2v2h-2zm0-2a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-.75 1.75c0-.28.22-.5.5-.5h2.5c.28 0 .5.22.5.5v2.5a.5.5 0 0 1-.5.5h-2.5a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `rectangle_landscape_16_regular`. */
export const FluentRefRectangleIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM3.5 4C2.67 4 2 4.67 2 5.5v5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `rectangle_landscape_16_filled`. */
export const FluentRefRectangleFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 3A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 12.5 3z" />
  </svg>
);

/** Fluent `circle_16_regular`. */
export const FluentRefEllipseIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `circle_16_filled`. */
export const FluentRefEllipseFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1" />
  </svg>
);

/** Fluent `add_square_16_regular`. */
export const FluentRefSquarePlusIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM8 4.5c.28 0 .5.22.5.5v2.5H11a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V8.5H5a.5.5 0 0 1 0-1h2.5V5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `add_square_16_filled`. */
export const FluentRefSquarePlusFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm6 0a.5.5 0 0 0-.5.5v2.5H5a.5.5 0 0 0 0 1h2.5V11a.5.5 0 0 0 1 0V8.5H11a.5.5 0 0 0 0-1H8.5V5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `subtract_square_16_regular`. */
export const FluentRefSquareMinusIcon = () => (
  <svg {...base}>
    <path d="M5.5 7.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `subtract_square_16_filled`. */
export const FluentRefSquareMinusFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm3.5 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `arrow_square_down_20_regular`. */
export const FluentRefSquareArrowUpIcon = () => (
  <svg {...base}>
    <path d="M10.5 6.5a.5.5 0 0 0-1 0v5.8L6.85 9.64a.5.5 0 1 0-.7.7l3.5 3.5c.2.2.5.2.7 0l3.5-3.5a.5.5 0 1 0-.7-.7l-2.65 2.64zM5 3a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `arrow_square_down_20_filled`. */
export const FluentRefSquareArrowUpFilledIcon = () => (
  <svg {...base}>
    <path d="M5 3a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm5.5 3.5v5.8l2.65-2.65a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 .7-.7l2.65 2.64V6.5a.5.5 0 0 1 1 0" />
  </svg>
);

/** Fluent `arrow_square_up_right_20_regular`. */
export const FluentRefSquareArrowUpRightIcon = () => (
  <svg {...base}>
    <path d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM4 6c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm8.7 1.04.15.1a.5.5 0 0 1 .15.36v5a.5.5 0 0 1-1 0V8.7l-4.15 4.15a.5.5 0 0 1-.7-.7L11.29 8H7.5a.5.5 0 0 1 0-1h5a1 1 0 0 1 .2.04" />
  </svg>
);

/** Fluent `arrow_square_up_right_20_filled`. */
export const FluentRefSquareArrowUpRightFilledIcon = () => (
  <svg {...base}>
    <path d="M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm9.7 1.04a1 1 0 0 0-.2-.04h-5a.5.5 0 0 0 0 1h3.8l-4.15 4.15a.5.5 0 0 0 .7.7L12 8.71v3.79a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.14-.35 1 1 0 0 0-.17-.11" />
  </svg>
);

/** Fluent `textbox_16_regular`. */
export const FluentRefSquareTextIcon = () => (
  <svg {...base}>
    <path d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm-1-8A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `textbox_16_filled`. */
export const FluentRefSquareTextFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm1 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1m0 2.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `textbox_16_regular`. */
export const FluentRefSquareTextCursorIcon = () => (
  <svg {...base}>
    <path d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm-1-8A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `textbox_16_filled`. */
export const FluentRefSquareTextCursorFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm1 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1m0 2.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `text_bullet_list_square_16_regular`. */
export const FluentRefSquareListIcon = () => (
  <svg {...base}>
    <path d="M5.5 5A.75.75 0 1 1 4 5a.75.75 0 0 1 1.5 0m0 3A.75.75 0 1 1 4 8a.75.75 0 0 1 1.5 0m-.75 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6.5 5c0-.28.22-.5.5-.5h4.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5M7 7.5a.5.5 0 0 0 0 1h4.5a.5.5 0 0 0 0-1zM6.5 11c0-.28.22-.5.5-.5h4.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5m-2-9A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `text_bullet_list_square_16_filled`. */
export const FluentRefSquareListFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm3.5.5A.75.75 0 1 0 4 5a.75.75 0 0 0 1.5 0m0 3A.75.75 0 1 0 4 8a.75.75 0 0 0 1.5 0m-.75 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6.5 5c0 .28.22.5.5.5h4.5a.5.5 0 0 0 0-1H7a.5.5 0 0 0-.5.5M7 7.5a.5.5 0 0 0 0 1h4.5a.5.5 0 0 0 0-1zM6.5 11c0 .28.22.5.5.5h4.5a.5.5 0 0 0 0-1H7a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `chevron_circle_down_16_regular`. */
export const FluentRefChevronDownCircleIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2m2.65 4.65a.5.5 0 1 1 .7.7l-3 3a.5.5 0 0 1-.7 0l-3-3a.5.5 0 1 1 .7-.7L8 9.29z" />
  </svg>
);

/** Fluent `chevron_circle_down_16_filled`. */
export const FluentRefChevronDownCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m3.35 5.65a.5.5 0 0 0-.7 0L8 9.29 5.35 6.65a.5.5 0 1 0-.7.7l3 3c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `play_circle_16_regular`. */
export const FluentRefPlayCircleIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2M6 6.25c0-.58.63-.94 1.13-.65l3 1.75c.5.3.5 1 0 1.3l-3 1.75A.75.75 0 0 1 6 9.75z" />
  </svg>
);

/** Fluent `play_circle_16_filled`. */
export const FluentRefPlayCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m-.87 4.6A.75.75 0 0 0 6 6.25v3.5c0 .58.63.94 1.13.65l3-1.75c.5-.3.5-1 0-1.3z" />
  </svg>
);

/** Fluent `pause_circle_16_regular`. */
export const FluentRefPauseCircleIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2M6.5 5c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5m3 0c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `pause_circle_16_filled`. */
export const FluentRefPauseCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1M6.5 5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5m3 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `circle_hint_16_regular`. */
export const FluentRefCircleDashedIcon = () => (
  <svg {...base}>
    <path d="M4.86 2.38a.48.48 0 0 0-.7-.23 7 7 0 0 0-2.02 2.01.48.48 0 0 0 .23.7c.24.1.5 0 .65-.2q.66-.98 1.63-1.64c.21-.14.3-.4.2-.64m1.99-.27a.54.54 0 0 1-.6-.3.47.47 0 0 1 .32-.66 7 7 0 0 1 2.85 0c.3.06.45.37.33.65a.54.54 0 0 1-.6.31 6 6 0 0 0-2.3 0m6.78 2.75c-.24.1-.5 0-.65-.21a6 6 0 0 0-1.63-1.63.54.54 0 0 1-.21-.65c.11-.27.45-.4.7-.23q1.21.8 2.02 2.02c.16.25.04.58-.23.7m.57 4.9a.54.54 0 0 1-.31-.6 6 6 0 0 0 0-2.31.54.54 0 0 1 .31-.6c.28-.12.6.03.66.32a7 7 0 0 1 0 2.86.47.47 0 0 1-.66.33m-3.06 3.87c-.1-.24 0-.5.2-.65q.98-.66 1.64-1.63c.14-.21.4-.3.64-.2.28.1.4.44.23.7a7 7 0 0 1-2.01 2 .48.48 0 0 1-.7-.22m-4.9.57c.1-.24.36-.36.6-.31a6 6 0 0 0 2.31 0c.25-.05.5.07.6.31.12.28-.03.6-.33.66a7 7 0 0 1-2.85 0 .47.47 0 0 1-.33-.66m-3.86-3.06c.23-.1.5 0 .64.2q.66.98 1.63 1.64c.21.14.3.4.2.64a.48.48 0 0 1-.7.23 7 7 0 0 1-2-2.01.48.48 0 0 1 .23-.7m-.58-4.9c.24.1.36.36.31.61a6 6 0 0 0 0 2.3c.05.25-.07.5-.3.6a.47.47 0 0 1-.66-.33 7 7 0 0 1 0-2.84c.06-.3.37-.45.65-.33" />
  </svg>
);

/** Fluent `circle_hint_16_filled`. */
export const FluentRefCircleDashedFilledIcon = () => (
  <svg {...base}>
    <path d="M4.97 2.64c-.18-.42-.68-.6-1.04-.33q-.95.67-1.62 1.62c-.27.36-.09.87.33 1.04.35.14.75 0 .98-.3q.46-.6 1.05-1.05c.3-.23.44-.63.3-.98m2.29-.09a.84.84 0 0 1-.9-.49c-.18-.41.05-.9.5-.97a7 7 0 0 1 2.28 0c.45.08.68.56.5.97a.84.84 0 0 1-.9.49 6 6 0 0 0-1.48 0m6.1 2.42a.84.84 0 0 1-.98-.3q-.46-.6-1.05-1.05a.84.84 0 0 1-.3-.98c.18-.42.68-.6 1.04-.33q.95.67 1.62 1.62c.27.36.09.86-.33 1.04m.57 4.68a.84.84 0 0 1-.48-.9 6 6 0 0 0 0-1.5.84.84 0 0 1 .49-.9c.41-.17.9.06.97.5a7 7 0 0 1 0 2.3c-.08.44-.56.67-.98.5m-2.9 3.71a.84.84 0 0 1 .3-.98q.6-.46 1.05-1.05c.23-.3.63-.44.98-.3.42.18.6.68.33 1.05q-.68.94-1.62 1.61c-.36.27-.86.09-1.04-.33m-4.68.58a.84.84 0 0 1 .9-.49 6 6 0 0 0 1.5 0c.37-.05.75.13.9.48.17.42-.06.9-.5.98a7 7 0 0 1-2.3 0c-.44-.08-.67-.56-.5-.97m-3.71-2.9c.35-.15.75-.01.98.29q.46.6 1.05 1.05c.3.23.44.63.3.98-.18.42-.68.6-1.04.33q-.95-.67-1.62-1.62c-.27-.36-.09-.86.33-1.04m-.58-4.69c.36.15.54.53.49.9a6 6 0 0 0 0 1.5.84.84 0 0 1-.48.9c-.42.17-.9-.06-.98-.5a7 7 0 0 1 0-2.3c.08-.44.56-.67.97-.5" />
  </svg>
);

/** Fluent `checkmark_circle_hint_16_regular`. */
export const FluentRefCircleCheckDashedIcon = () => (
  <svg {...base}>
    <path d="M6.84 13.89a6 6 0 0 0 2.3 0c.26-.05.52.08.61.31.12.28-.03.6-.33.66a7 7 0 0 1-2.85 0 .47.47 0 0 1-.33-.66c.1-.24.36-.36.6-.31m6.14-2.54c.14-.2.4-.3.64-.2.28.1.4.44.23.7a7 7 0 0 1-2.01 2 .48.48 0 0 1-.7-.22c-.1-.24 0-.5.2-.65q.98-.66 1.64-1.63m-10.6-.2c.23-.1.5-.01.64.2q.66.97 1.63 1.63c.2.14.3.4.2.64a.48.48 0 0 1-.7.23 7 7 0 0 1-2-2.01.48.48 0 0 1 .23-.7m7.77-5a.5.5 0 1 1 .7.7L7.6 10.1a.5.5 0 0 1-.7 0L5.15 8.35a.5.5 0 0 1 .63-.77l.07.07 1.4 1.4zm4.05.1c.28-.12.6.03.65.32a7 7 0 0 1 0 2.86.5.5 0 0 1-.65.33.54.54 0 0 1-.31-.6 6 6 0 0 0 0-2.31.54.54 0 0 1 .3-.6m-13.06.33c.07-.3.38-.45.66-.33.23.1.36.35.31.6a6 6 0 0 0 0 2.3c.05.25-.07.5-.3.6a.47.47 0 0 1-.66-.33 7 7 0 0 1 0-2.84m3.02-4.43a.48.48 0 0 1 .7.23c.1.23 0 .5-.21.64q-.97.67-1.63 1.63a.54.54 0 0 1-.65.21.47.47 0 0 1-.23-.7 7 7 0 0 1 2.02-2.01m6.98.22c.11-.27.45-.4.7-.23q1.21.8 2.01 2.02c.17.25.05.58-.23.7-.23.1-.5 0-.64-.21a6 6 0 0 0-1.63-1.63.54.54 0 0 1-.21-.65M8 1q.73 0 1.42.14c.3.07.45.38.33.66a.54.54 0 0 1-.6.31 6 6 0 0 0-2.3 0 .54.54 0 0 1-.6-.3.48.48 0 0 1 .32-.66Q7.27 1 8 1" />
  </svg>
);

/** Fluent `checkmark_circle_hint_16_filled`. */
export const FluentRefCircleCheckDashedFilledIcon = () => (
  <svg {...base}>
    <path d="M8.74 13.45c.38-.05.76.13.9.48.18.42-.05.9-.5.98a7 7 0 0 1-2.28 0c-.45-.08-.68-.56-.5-.98a.84.84 0 0 1 .9-.48 6 6 0 0 0 1.48 0m-6.1-2.42c.35-.14.75 0 .98.3q.46.6 1.05 1.05c.3.23.44.63.3.98-.18.42-.68.6-1.04.33q-.95-.68-1.62-1.61c-.27-.37-.09-.87.33-1.05m9.74.3c.23-.3.63-.44.98-.3.42.18.6.68.33 1.05q-.68.94-1.62 1.61c-.36.27-.86.09-1.04-.33a.84.84 0 0 1 .3-.98q.6-.46 1.05-1.05M9.97 5.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.97 8.53a.75.75 0 0 1 1-1.11l.06.05 1.22 1.22zm-8.88.89c.08-.45.56-.68.97-.5.36.14.54.52.49.9a6 6 0 0 0 0 1.48.84.84 0 0 1-.48.9c-.42.18-.9-.05-.98-.5a7 7 0 0 1 0-2.28m12.85-.5c.41-.18.9.05.97.5a7 7 0 0 1 0 2.29c-.08.44-.56.67-.98.5a.84.84 0 0 1-.48-.9 6 6 0 0 0 0-1.5.84.84 0 0 1 .49-.9M3.93 2.3c.36-.27.86-.09 1.04.33.14.35 0 .75-.3.98q-.6.46-1.05 1.05a.84.84 0 0 1-.98.3c-.42-.17-.6-.68-.33-1.04q.67-.94 1.62-1.62m7.1.33c.18-.42.68-.6 1.04-.33q.95.67 1.62 1.62c.27.36.09.87-.33 1.04a.84.84 0 0 1-.98-.3q-.46-.6-1.05-1.05a.84.84 0 0 1-.3-.98M8 1q.59 0 1.14.1c.45.07.68.55.5.97a.84.84 0 0 1-.9.48 6 6 0 0 0-1.48 0 .84.84 0 0 1-.9-.48c-.18-.42.05-.9.5-.98Q7.4 1 8 1" />
  </svg>
);

/** Fluent `alert_badge_16_regular`. */
export const FluentRefBellDotIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h3a2 2 0 1 0 4 0h3a.5.5 0 0 0 .46-.69l-.96-2.4V7q-.54 0-1-.2V9q0 .09.04.18l.72 1.82H3.74l.72-1.82L4.5 9V6.5a3.5 3.5 0 0 1 5.62-2.78q.17-.5.5-.87A4.5 4.5 0 0 0 8 2m1 10a1 1 0 0 1-1 1 1 1 0 0 1-1-1zm2.37-8.48a1.5 1.5 0 0 0-.03 1.93 1.5 1.5 0 1 0 .03-1.93" />
  </svg>
);

/** Fluent `alert_badge_16_filled`. */
export const FluentRefBellDotFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h10a.5.5 0 0 0 .46-.69l-.96-2.4V7a2.5 2.5 0 0 1-1.87-4.15A4.5 4.5 0 0 0 8 2m0 12.5A2 2 0 0 1 6.06 13h3.88A2 2 0 0 1 8 14.5M12.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

/** Fluent `mail_unread_16_regular`. */
export const FluentRefMailDotIcon = () => (
  <svg {...base}>
    <path d="M14 5.23A2 2 0 1 0 11.06 3 2 2 0 0 0 14 5.23M4 3h6.04a3 3 0 0 0 0 1H4a1 1 0 0 0-1 1v.74l5 2.7 3.94-2.13a3 3 0 0 0 2.06.02V11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2M3 6.88V11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6.88L8.24 9.44a.5.5 0 0 1-.48 0z" />
  </svg>
);

/** Fluent `mail_unread_16_filled`. */
export const FluentRefMailDotFilledIcon = () => (
  <svg {...base}>
    <path d="M13.64 5.4A2 2 0 1 0 11.06 3a2 2 0 0 0 2.58 2.4M4 3h6.04a3 3 0 0 0 1.9 3.3L8 8.44 2 5.2V5c0-1.1.9-2 2-2m10 3.34-5.76 3.1a.5.5 0 0 1-.48 0L2 6.34V11c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2z" />
  </svg>
);

/** Fluent `desktop_checkmark_16_regular`. */
export const FluentRefDesktopCheckIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 6.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7M10.5 11H12a1 1 0 0 0 .89-.54q.6-.3 1.11-.72V10a2 2 0 0 1-2 2h-2v1h1.5a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1H6v-1H4a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h2.26q-.39.46-.66 1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6.5M9 12H7v1h2z" />
  </svg>
);

/** Fluent `desktop_checkmark_16_filled`. */
export const FluentRefDesktopCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 6.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7M10.5 11c1.33 0 2.55-.47 3.5-1.26v.76c0 .83-.67 1.5-1.5 1.5H10v1h1.5a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1H6v-1H3.5A1.5 1.5 0 0 1 2 10.5v-7C2 2.67 2.67 2 3.5 2h2.76a5.5 5.5 0 0 0 4.24 9M9 12H7v1h2z" />
  </svg>
);

/** Fluent `beaker_off_20_regular`. */
export const FluentRefFlaskOffIcon = () => (
  <svg {...base}>
    <path d="M2.85 2.15a.5.5 0 1 0-.7.7L6.99 7.7v.99a3.5 3.5 0 0 1-.41 1.66l-2.4 4.44A1.5 1.5 0 0 0 5.5 17h9c.5 0 .93-.24 1.2-.6l1.45 1.45a.5.5 0 0 0 .7-.7zm12.12 13.52a.5.5 0 0 1-.47.33h-9a.5.5 0 0 1-.44-.74L6.28 13h6.01zM11.29 12H6.82l.64-1.18a4.5 4.5 0 0 0 .53-2.12zM12 8.68q0 .75.24 1.44l2.3 2.3-1.12-2.08A3.5 3.5 0 0 1 13 8.68V4h1a.5.5 0 0 0 0-1H6a.5.5 0 0 0-.49.4l.61.6H7v.87l1 1V4H12z" />
  </svg>
);

/** Fluent `beaker_off_20_filled`. */
export const FluentRefFlaskOffFilledIcon = () => (
  <svg {...base}>
    <path d="M2.85 2.15a.5.5 0 1 0-.7.7L6.99 7.7v.99a3.5 3.5 0 0 1-.41 1.66L5.68 12h5.61l1 1H5.15l-.97 1.79A1.5 1.5 0 0 0 5.5 17h9c.5 0 .93-.24 1.2-.6l1.45 1.45a.5.5 0 0 0 .7-.7zM7 4.87 14.12 12h.2l-.9-1.66A3.5 3.5 0 0 1 13 8.68V4h1a.5.5 0 0 0 0-1H6a.5.5 0 0 0-.49.4l.61.6H7z" />
  </svg>
);

/** Fluent `agents_16_regular`. */
export const FluentRefAgentCircleIcon = () => (
  <svg {...base}>
    <path d="M5.1 3a.5.5 0 0 0-.43.25l-2.6 4.5a.5.5 0 0 0 0 .5l2.5 4.34a.83.83 0 0 0 1.5-.17l2.9-9.14a1.83 1.83 0 0 1 3.32-.37l2.5 4.34a1.5 1.5 0 0 1 0 1.5l-2.6 4.5a1.5 1.5 0 0 1-1.3.75H8.5a.5.5 0 0 1 0-1h2.4a.5.5 0 0 0 .43-.25l2.6-4.5a.5.5 0 0 0 0-.5l-2.5-4.34a.83.83 0 0 0-1.5.17l-2.9 9.14a1.83 1.83 0 0 1-3.32.37L1.2 8.75a1.5 1.5 0 0 1 0-1.5l2.6-4.5A1.5 1.5 0 0 1 5.1 2h2.4a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `agents_16_filled`. */
export const FluentRefAgentCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8.06 2.75q.12-.42.38-.75H5.1a1.5 1.5 0 0 0-1.3.75l-2.6 4.5a1.5 1.5 0 0 0 0 1.5l2.31 4A2.5 2.5 0 0 0 5.61 14 1.5 1.5 0 0 0 7 12.95l3.03-9.6a.5.5 0 0 1 .96.3l-3.04 9.6a3 3 0 0 1-.38.75h3.34a1.5 1.5 0 0 0 1.3-.75l2.6-4.5a1.5 1.5 0 0 0 0-1.5l-2.31-4A2.5 2.5 0 0 0 10.39 2 1.5 1.5 0 0 0 9 3.05l-3.03 9.6a.5.5 0 1 1-.96-.3z" />
  </svg>
);

/** Fluent `agents_16_regular`. */
export const FluentRefAgentSquareIcon = () => (
  <svg {...base}>
    <path d="M5.1 3a.5.5 0 0 0-.43.25l-2.6 4.5a.5.5 0 0 0 0 .5l2.5 4.34a.83.83 0 0 0 1.5-.17l2.9-9.14a1.83 1.83 0 0 1 3.32-.37l2.5 4.34a1.5 1.5 0 0 1 0 1.5l-2.6 4.5a1.5 1.5 0 0 1-1.3.75H8.5a.5.5 0 0 1 0-1h2.4a.5.5 0 0 0 .43-.25l2.6-4.5a.5.5 0 0 0 0-.5l-2.5-4.34a.83.83 0 0 0-1.5.17l-2.9 9.14a1.83 1.83 0 0 1-3.32.37L1.2 8.75a1.5 1.5 0 0 1 0-1.5l2.6-4.5A1.5 1.5 0 0 1 5.1 2h2.4a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `agents_16_filled`. */
export const FluentRefAgentSquareFilledIcon = () => (
  <svg {...base}>
    <path d="M8.06 2.75q.12-.42.38-.75H5.1a1.5 1.5 0 0 0-1.3.75l-2.6 4.5a1.5 1.5 0 0 0 0 1.5l2.31 4A2.5 2.5 0 0 0 5.61 14 1.5 1.5 0 0 0 7 12.95l3.03-9.6a.5.5 0 0 1 .96.3l-3.04 9.6a3 3 0 0 1-.38.75h3.34a1.5 1.5 0 0 0 1.3-.75l2.6-4.5a1.5 1.5 0 0 0 0-1.5l-2.31-4A2.5 2.5 0 0 0 10.39 2 1.5 1.5 0 0 0 9 3.05l-3.03 9.6a.5.5 0 1 1-.96-.3z" />
  </svg>
);

/** Fluent `agents_16_regular`. */
export const FluentRefAgentIcon = () => (
  <svg {...base}>
    <path d="M5.1 3a.5.5 0 0 0-.43.25l-2.6 4.5a.5.5 0 0 0 0 .5l2.5 4.34a.83.83 0 0 0 1.5-.17l2.9-9.14a1.83 1.83 0 0 1 3.32-.37l2.5 4.34a1.5 1.5 0 0 1 0 1.5l-2.6 4.5a1.5 1.5 0 0 1-1.3.75H8.5a.5.5 0 0 1 0-1h2.4a.5.5 0 0 0 .43-.25l2.6-4.5a.5.5 0 0 0 0-.5l-2.5-4.34a.83.83 0 0 0-1.5.17l-2.9 9.14a1.83 1.83 0 0 1-3.32.37L1.2 8.75a1.5 1.5 0 0 1 0-1.5l2.6-4.5A1.5 1.5 0 0 1 5.1 2h2.4a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `agents_16_filled`. */
export const FluentRefAgentFilledIcon = () => (
  <svg {...base}>
    <path d="M8.06 2.75q.12-.42.38-.75H5.1a1.5 1.5 0 0 0-1.3.75l-2.6 4.5a1.5 1.5 0 0 0 0 1.5l2.31 4A2.5 2.5 0 0 0 5.61 14 1.5 1.5 0 0 0 7 12.95l3.03-9.6a.5.5 0 0 1 .96.3l-3.04 9.6a3 3 0 0 1-.38.75h3.34a1.5 1.5 0 0 0 1.3-.75l2.6-4.5a1.5 1.5 0 0 0 0-1.5l-2.31-4A2.5 2.5 0 0 0 10.39 2 1.5 1.5 0 0 0 9 3.05l-3.03 9.6a.5.5 0 1 1-.96-.3z" />
  </svg>
);

/** Fluent `chat_sparkle_16_regular`. */
export const FluentRefChatSparkleIcon = () => (
  <svg {...base}>
    <path d="M8 1q.39 0 .78.04a1 1 0 0 1-.29.47q-.2.2-.45.3l-.74.23a6 6 0 0 0-4.37 9.17q.12.2.05.42l-.69 2.08 2.08-.7q.22-.06.42.06a5.97 5.97 0 0 0 7.91-1.35l.06.05a1.3 1.3 0 0 0 1 .2 7 7 0 0 1-9.3 2.07l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m5.48 5a.3.3 0 0 1 .29.2l.25.77a1.6 1.6 0 0 0 1 1l.76.24h.02a.3.3 0 0 1 0 .58l-.77.25a1.6 1.6 0 0 0-1 1l-.24.76a.3.3 0 0 1-.58 0l-.24-.77a1.6 1.6 0 0 0-1-1l-.77-.25a.3.3 0 0 1 0-.57l.77-.25a1.6 1.6 0 0 0 .98-1l.25-.76a.3.3 0 0 1 .28-.2m-3-6a.4.4 0 0 1 .4.28l.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.43.43 0 0 1 .2.65.4.4 0 0 1-.2.15l-1.07.35a2.2 2.2 0 0 0-1.4 1.4l-.35 1.07a.42.42 0 0 1-.64.2l-.02-.01a.4.4 0 0 1-.14-.2l-.35-1.06a2.2 2.2 0 0 0-1.4-1.4L7.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4l.35-1.07a.4.4 0 0 1 .4-.28" />
  </svg>
);

/** Fluent `chat_sparkle_16_filled`. */
export const FluentRefChatSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1q.39 0 .78.04a1 1 0 0 1-.29.47q-.2.2-.45.3l-1.09.34A1.4 1.4 0 0 0 6 3.5q0 .45.26.82t.71.53l1.06.35q.22.06.47.29.16.14.3.47l.35 1.1q.13.36.52.68.22.15.45.21a1.3 1.3 0 0 0 .77 1.79l.77.25q.13.05.22.14.1.1.14.22l.26.8q.15.38.48.62a1.3 1.3 0 0 0 1 .2 7 7 0 0 1-9.3 2.07l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m5.48 5a.3.3 0 0 1 .29.2l.25.77a1.6 1.6 0 0 0 1 1l.76.24h.02a.3.3 0 0 1 0 .58l-.77.25a1.6 1.6 0 0 0-1 1l-.24.76a.3.3 0 0 1-.58 0l-.24-.77a1.6 1.6 0 0 0-1-1l-.77-.25a.3.3 0 0 1 0-.57l.77-.25a1.6 1.6 0 0 0 .98-1l.25-.76a.3.3 0 0 1 .28-.2m-3-6a.4.4 0 0 1 .4.28l.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.43.43 0 0 1 .2.65.4.4 0 0 1-.2.15l-1.07.35a2.2 2.2 0 0 0-1.4 1.4l-.35 1.07a.42.42 0 0 1-.64.2l-.02-.01a.4.4 0 0 1-.14-.2l-.35-1.06a2.2 2.2 0 0 0-1.4-1.4L7.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4l.35-1.07a.4.4 0 0 1 .4-.28" />
  </svg>
);

/** Fluent `arrow_bidirectional_left_right_16_regular`. */
export const FluentRefArrowLeftRightIcon = () => (
  <svg {...base}>
    <path d="M2.15 8.85a.5.5 0 0 1 0-.7l3-3a.5.5 0 1 1 .7.7L3.71 8h8.58l-2.14-2.15a.5.5 0 0 1 .7-.7l3 3c.2.2.2.5 0 .7l-3 3a.5.5 0 0 1-.7-.7L12.29 9H3.71l2.14 2.15a.5.5 0 1 1-.7.7z" />
  </svg>
);

/** Fluent `arrow_bidirectional_left_right_16_filled`. */
export const FluentRefArrowLeftRightFilledIcon = () => (
  <svg {...base}>
    <path d="M6.03 5.22c.3.3.3.77 0 1.06L4.56 7.75h6.88L9.97 6.28a.75.75 0 0 1 1.06-1.06l2.75 2.75c.3.3.3.77 0 1.06l-2.75 2.75a.75.75 0 1 1-1.06-1.06l1.47-1.47H4.56l1.47 1.47a.75.75 0 1 1-1.06 1.06L2.22 9.03a.75.75 0 0 1 0-1.06l2.75-2.75c.3-.3.77-.3 1.06 0" />
  </svg>
);

/** Fluent `arrow_swap_16_regular`. */
export const FluentRefArrowRightLeftIcon = () => (
  <svg {...base}>
    <path d="M10.35 1.65a.5.5 0 0 0-.7.7L11.29 4H3.5a.5.5 0 0 0 0 1h7.8L9.64 6.65a.5.5 0 1 0 .7.7l2.5-2.5a.5.5 0 0 0 0-.7zm-4 7.7a.5.5 0 1 0-.7-.7l-2.5 2.5a.5.5 0 0 0 0 .7l2.5 2.5a.5.5 0 0 0 .7-.7L4.71 12h7.79a.5.5 0 0 0 0-1H4.7z" />
  </svg>
);

/** Fluent `arrow_swap_16_filled`. */
export const FluentRefArrowRightLeftFilledIcon = () => (
  <svg {...base}>
    <path d="M10.28 1.72a.75.75 0 1 0-1.06 1.06L10.44 4H3.75a.75.75 0 0 0 0 1.5h6.69L9.22 6.72a.75.75 0 0 0 1.06 1.06l2.5-2.5c.3-.3.3-.77 0-1.06zm-3.5 7.56a.75.75 0 0 0-1.06-1.06l-2.5 2.5c-.3.3-.3.77 0 1.06l2.5 2.5a.75.75 0 0 0 1.06-1.06L5.56 12h6.69a.75.75 0 0 0 0-1.5H5.56z" />
  </svg>
);

/** Fluent `arrow_export_ltr_16_regular`. */
export const FluentRefArrowRightToLineIcon = () => (
  <svg {...base}>
    <path d="M1.5 3c.28 0 .5.22.5.5V12a.5.5 0 0 1-1 0V3.5c0-.28.22-.5.5-.5m9.15.65c.2-.2.5-.2.7 0l3.5 3.5c.2.2.2.5 0 .7l-3.5 3.5a.5.5 0 0 1-.7-.7L13.29 8H4.5a.5.5 0 0 1 0-1h8.8l-2.65-2.65a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `arrow_export_ltr_16_filled`. */
export const FluentRefArrowRightToLineFilledIcon = () => (
  <svg {...base}>
    <path d="M1.75 3c.41 0 .75.34.75.75v8.5a.75.75 0 0 1-1.5 0v-8.5c0-.41.34-.75.75-.75m8.47.72c.3-.3.77-.3 1.06 0l3.5 3.5c.3.3.3.77 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H4.75a.75.75 0 0 1 0-1.5h7.69l-2.22-2.22a.75.75 0 0 1 0-1.06" />
  </svg>
);

/** Fluent `chevron_double_right_16_regular`. */
export const FluentRefChevronsRightIcon = () => (
  <svg {...base}>
    <path d="M3.65 3.15c.2-.2.5-.2.7 0l4.5 4.5a.5.5 0 0 1 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7L7.79 8 3.65 3.85a.5.5 0 0 1 0-.7m4 0c.2-.2.5-.2.7 0l4.5 4.5a.5.5 0 0 1 .14.45.5.5 0 0 1-.14.25l-4.5 4.5a.5.5 0 0 1-.7-.7L11.79 8 7.65 3.85a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `chevron_double_right_16_filled`. */
export const FluentRefChevronsRightFilledIcon = () => (
  <svg {...base}>
    <path d="M3.47 3.22c.3-.3.77-.3 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L7.19 8 3.47 4.28a.75.75 0 0 1 0-1.06m4.5 0c.3-.3.77-.3 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.69 8 7.97 4.28a.75.75 0 0 1 0-1.06" />
  </svg>
);

/** Fluent `document_multiple_16_regular`. */
export const FluentRefFilesIcon = () => (
  <svg {...base}>
    <path d="M14 6a1 1 0 0 0-1-1v6a3 3 0 0 1-3 3H5a1 1 0 0 0 1 1h4.21c2.1 0 3.79-1.7 3.79-3.79zM5 1a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2V4.41c0-.4-.16-.78-.44-1.06L9.64 1.44A1.5 1.5 0 0 0 8.58 1zm5 11H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3v1.5C8 4.33 8.67 5 9.5 5H11v6a1 1 0 0 1-1 1m.8-8H9.5a.5.5 0 0 1-.5-.5V2.2z" />
  </svg>
);

/** Fluent `document_multiple_16_filled`. */
export const FluentRefFilesFilledIcon = () => (
  <svg {...base}>
    <path d="M14 6a1 1 0 0 0-1-1v6a3 3 0 0 1-3 3H5a1 1 0 0 0 1 1h4.21c2.1 0 3.79-1.7 3.79-3.79zM7 1v3.5C7 5.33 7.67 6 8.5 6H12v5.5c0 .83-.67 1.5-1.5 1.5h-6A1.5 1.5 0 0 1 3 11.5v-9C3 1.67 3.67 1 4.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25z" />
  </svg>
);

/** Fluent `document_arrow_right_16_regular`. */
export const FluentRefFileExportIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H8.66q.6-.42 1.08-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6.5 2h2.3L10 2.2v2.3c0 .28.22.5.5.5m-5 1a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m2.35 4.85A.5.5 0 0 0 8 10.5a.5.5 0 0 0-.15-.35l-2-2a.5.5 0 1 0-.7.7L6.29 10H3.5a.5.5 0 0 0 0 1h2.8l-1.15 1.15a.5.5 0 0 0 .7.7z" />
  </svg>
);

/** Fluent `document_arrow_right_16_filled`. */
export const FluentRefFileExportFilledIcon = () => (
  <svg {...base}>
    <path d="M9 4.5V1H5.5C4.67 1 4 1.67 4 2.5v2.7A5.5 5.5 0 0 1 8.66 15h3.84c.83 0 1.5-.67 1.5-1.5V6h-3.5A1.5 1.5 0 0 1 9 4.5m1 0V1.25L13.75 5H10.5a.5.5 0 0 1-.5-.5M5.5 6a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9m2.35 4.85-2 2a.5.5 0 0 1-.7-.7L6.29 11H3.5a.5.5 0 0 1 0-1h2.8L5.14 8.85a.5.5 0 1 1 .7-.7l2 2a.5.5 0 0 1 .15.35.5.5 0 0 1-.14.35" />
  </svg>
);

/** Fluent `clipboard_task_list_16_regular`. */
export const FluentRefClipboardListIcon = () => (
  <svg {...base}>
    <path d="M8.5 6.5c0-.28.22-.5.5-.5h1.5a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h1.5a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5M5.5 8a.5.5 0 0 1-.35-.15l-.5-.5a.5.5 0 0 1 .7-.7l.15.14 1.15-1.14a.5.5 0 0 1 .7.7l-1.5 1.5A.5.5 0 0 1 5.5 8m-.35 3.85a.5.5 0 0 0 .7 0l1.5-1.5a.5.5 0 0 0-.7-.7L5.5 10.79l-.15-.14a.5.5 0 0 0-.7.7zM5.08 2c.21-.58.77-1 1.42-1h3c.65 0 1.2.42 1.41 1h.59c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-10C3 2.67 3.67 2 4.5 2zM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM5.09 3H4.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5h-.59c-.2.58-.76 1-1.41 1h-3a1.5 1.5 0 0 1-1.41-1m.4 9" />
  </svg>
);

/** Fluent `clipboard_task_list_16_filled`. */
export const FluentRefClipboardListFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 2h-.59c-.2-.58-.76-1-1.41-1h-3c-.65 0-1.2.42-1.41 1H4.5C3.67 2 3 2.67 3 3.5v10c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-10c0-.83-.67-1.5-1.5-1.5m-5 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m.85 8.35-1.5 1.5a.5.5 0 0 1-.7 0l-.5-.5a.5.5 0 0 1 .7-.7l.15.14 1.14-1.14a.5.5 0 0 1 .71.7m0-4-1.5 1.5a.5.5 0 0 1-.7 0l-.5-.5a.5.5 0 0 1 .7-.7l.15.14 1.14-1.14a.5.5 0 0 1 .71.7M10.5 11H9a.5.5 0 0 1 0-1h1.5a.5.5 0 0 1 0 1m0-4H9a.5.5 0 0 1 0-1h1.5a.5.5 0 0 1 0 1" />
  </svg>
);

/** Fluent `hexagon_16_regular`. */
export const FluentRefHexagonIcon = () => (
  <svg {...base}>
    <path d="M5.4 3a.5.5 0 0 0-.43.25l-2.6 4.5a.5.5 0 0 0 0 .5l2.6 4.5a.5.5 0 0 0 .43.25h5.2a.5.5 0 0 0 .43-.25l2.6-4.5a.5.5 0 0 0 0-.5l-2.6-4.5A.5.5 0 0 0 10.6 3zm-1.3-.25A1.5 1.5 0 0 1 5.4 2h5.2c.54 0 1.03.29 1.3.75l2.6 4.5a1.5 1.5 0 0 1 0 1.5l-2.6 4.5a1.5 1.5 0 0 1-1.3.75H5.4a1.5 1.5 0 0 1-1.3-.75l-2.6-4.5a1.5 1.5 0 0 1 0-1.5z" />
  </svg>
);

/** Fluent `hexagon_16_filled`. */
export const FluentRefHexagonFilledIcon = () => (
  <svg {...base}>
    <path d="M5.4 2a1.5 1.5 0 0 0-1.3.75l-2.6 4.5a1.5 1.5 0 0 0 0 1.5l2.6 4.5c.27.46.76.75 1.3.75h5.2a1.5 1.5 0 0 0 1.3-.75l2.6-4.5a1.5 1.5 0 0 0 0-1.5l-2.6-4.5A1.5 1.5 0 0 0 10.6 2z" />
  </svg>
);

/** Fluent `cube_16_regular`. */
export const FluentRefCubeIcon = () => (
  <svg {...base}>
    <path d="M4.7 5.04a.5.5 0 0 0-.4.92l3.2 1.37v3.17a.5.5 0 0 0 1 0V7.33l3.2-1.37a.5.5 0 1 0-.4-.92L8 6.46zm4.38-3.66a3 3 0 0 0-2.16 0l-4.96 1.9A1.5 1.5 0 0 0 1 4.69v6.63c0 .62.38 1.18.96 1.4l4.96 1.91a3 3 0 0 0 2.16 0l4.96-1.9c.58-.23.96-.79.96-1.4V4.68a1.5 1.5 0 0 0-.96-1.4zm-1.8.93a2 2 0 0 1 1.44 0l4.96 1.9c.2.08.32.27.32.48v6.62c0 .2-.13.4-.32.47l-4.96 1.9a2 2 0 0 1-1.44 0l-4.96-1.9A.5.5 0 0 1 2 11.3V4.7c0-.21.13-.4.32-.47z" />
  </svg>
);

/** Fluent `cube_16_filled`. */
export const FluentRefCubeFilledIcon = () => (
  <svg {...base}>
    <path d="M6.92 1.38a3 3 0 0 1 2.16 0l4.96 1.9c.58.23.96.79.96 1.4v6.63a1.5 1.5 0 0 1-.96 1.4l-4.96 1.91a3 3 0 0 1-2.16 0l-4.96-1.9a1.5 1.5 0 0 1-.96-1.4V4.68c0-.62.38-1.18.96-1.4zM4.7 5.04a.5.5 0 0 0-.4.92l3.2 1.37v3.17a.5.5 0 0 0 1 0V7.33l3.2-1.37a.5.5 0 1 0-.4-.92L8 6.46z" />
  </svg>
);

/** Fluent `text_asterisk_16_regular`. */
export const FluentRefAsteriskIcon = () => (
  <svg {...base}>
    <path d="M13.5 7.5H9.2l3.04-3.04a.5.5 0 0 0-.7-.7L8.5 6.79V2.5a.5.5 0 0 0-1 0v4.3L4.46 3.75a.5.5 0 0 0-.7.7L6.79 7.5H2.5a.5.5 0 0 0 0 1h4.3l-3.04 3.04a.5.5 0 0 0 .7.7L7.5 9.21v4.29a.5.5 0 0 0 1 0V9.2l3.04 3.04a.5.5 0 0 0 .7 0 .5.5 0 0 0 0-.7L9.22 8.5h4.3a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_asterisk_16_filled`. */
export const FluentRefAsteriskFilledIcon = () => (
  <svg {...base}>
    <path d="M8 14.25a.75.75 0 0 1-.75-.75V9.81l-2.6 2.61a.75.75 0 0 1-1.07 0 .75.75 0 0 1 0-1.06l2.6-2.61H2.5a.75.75 0 0 1 0-1.5h3.69l-2.61-2.6a.75.75 0 0 1 .53-1.29q.31 0 .53.22l2.6 2.6V2.5a.75.75 0 0 1 1.5 0v3.69l2.62-2.61a.75.75 0 1 1 1.06 1.06L9.8 7.25h3.69a.75.75 0 0 1 0 1.5H9.8l2.6 2.6a.75.75 0 0 1-1.05 1.07l-2.61-2.6v3.68c0 .41-.34.75-.75.75" />
  </svg>
);

/** Fluent `math_symbols_16_regular`. */
export const FluentRefPlusMinusIcon = () => (
  <svg {...base}>
    <path d="M4.5 2c.28 0 .5.22.5.5V4h1.5a.5.5 0 0 1 0 1H5v1.5a.5.5 0 0 1-1 0V5H2.5a.5.5 0 0 1 0-1H4V2.5c0-.28.22-.5.5-.5m5 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm-4.3 7.5 1.65-1.65a.5.5 0 1 0-.7-.7L4.5 10.79 2.85 9.15a.5.5 0 1 0-.7.7l1.64 1.65-1.64 1.65a.5.5 0 0 0 .7.7l1.65-1.64 1.65 1.64a.5.5 0 0 0 .7-.7zm6.3-1.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-2 .5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm3 2.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `math_symbols_16_filled`. */
export const FluentRefPlusMinusFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 6.25v-1h-1a.75.75 0 0 1 0-1.5h1v-1a.75.75 0 0 1 1.5 0v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0m6-2.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zm-7.53 8.97a.75.75 0 1 0 1.06 1.06l1.22-1.22 1.22 1.22a.75.75 0 0 0 1.06-1.06L5.56 11.5l1.22-1.22a.75.75 0 1 0-1.06-1.06L4.5 10.44 3.28 9.22a.75.75 0 0 0-1.06 1.06l1.22 1.22zM11.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-2 .25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5zm3 2.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `arrow_split_16_regular`. */
export const FluentRefSplitIcon = () => (
  <svg {...base}>
    <path d="M8 2c.28 0 .5.22.5.5V6h2c.83 0 1.5.67 1.5 1.5v4.8l1.15-1.15a.5.5 0 0 1 .7.7l-2 2a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L11 12.29V7.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v4.8l1.15-1.15a.5.5 0 0 1 .7.7l-2 2a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L4 12.29V7.5C4 6.67 4.67 6 5.5 6h2V2.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `arrow_split_16_filled`. */
export const FluentRefSplitFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2c.41 0 .75.34.75.75V6H11c.83 0 1.5.67 1.5 1.5v3.94l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2c-.3.3-.77.3-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V7.5H5v3.94l.72-.72a.75.75 0 0 1 1.06 1.06l-2 2c-.3.3-.77.3-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V7.5C3.5 6.67 4.17 6 5 6h2.25V2.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `branch_request_closed_16_regular`. */
export const FluentRefGitPullRequestClosedIcon = () => (
  <svg {...base}>
    <path d="M2 3.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m4 0a2.5 2.5 0 0 1-2 2.45v4.1a2.5 2.5 0 1 1-1 0v-4.1A2.5 2.5 0 1 1 6 3.5m-4 9a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m11-6a.5.5 0 0 0-1 0v3.55a2.5 2.5 0 1 0 1 0zm-.5 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m-1.85-9.35c.2-.2.5-.2.7 0l1.15 1.14 1.15-1.14a.5.5 0 0 1 .7.7L13.21 3.5l1.14 1.15a.5.5 0 0 1-.7.7L12.5 4.21l-1.15 1.14a.5.5 0 0 1-.7-.7l1.14-1.15-1.14-1.15a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `branch_request_closed_16_filled`. */
export const FluentRefGitPullRequestClosedFilledIcon = () => (
  <svg {...base}>
    <path d="M6 3.5a2.5 2.5 0 0 1-2 2.45v4.1a2.5 2.5 0 1 1-1 0v-4.1A2.5 2.5 0 1 1 6 3.5M12.5 15a2.5 2.5 0 0 0 .5-4.95V6.5a.5.5 0 0 0-1 0v3.55a2.5 2.5 0 0 0 .5 4.95M10.65 1.65c.2-.2.5-.2.7 0l1.15 1.14 1.15-1.14a.5.5 0 0 1 .7.7L13.21 3.5l1.14 1.15a.5.5 0 0 1-.7.7L12.5 4.21l-1.15 1.14a.5.5 0 0 1-.7-.7l1.14-1.15-1.14-1.15a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `branch_request_draft_16_regular`. */
export const FluentRefGitPullRequestDraftIcon = () => (
  <svg {...base}>
    <path d="M2 3.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m4 0a2.5 2.5 0 0 1-2 2.45v4.1a2.5 2.5 0 1 1-1 0v-4.1A2.5 2.5 0 1 1 6 3.5m-4 9a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m9 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m1.5-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m1-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `branch_request_draft_16_filled`. */
export const FluentRefGitPullRequestDraftFilledIcon = () => (
  <svg {...base}>
    <path d="M6 3.5a2.5 2.5 0 0 1-2 2.45v4.1a2.5 2.5 0 1 1-1 0v-4.1A2.5 2.5 0 1 1 6 3.5M12.5 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m1-8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `currency_dollar_euro_16_regular`. */
export const FluentRefDollarIcon = () => (
  <svg {...base}>
    <path d="M4.5 2a.5.5 0 0 0-.5.5v.33a2.7 2.7 0 0 0-2 2.6v.1c0 1.1.65 2.1 1.65 2.55l.35.16v3.87a1.7 1.7 0 0 1-1-1.55v-.72a.5.5 0 0 0-1 0v.72c0 1.25.85 2.3 2 2.61v.34a.5.5 0 0 0 1 0v-.26a2.7 2.7 0 0 0 2.4-2.69v-.09c0-1.1-.64-2.1-1.65-2.54L5 7.59V3.76c.8.14 1.4.84 1.4 1.67v.74a.5.5 0 0 0 1 0v-.74A2.7 2.7 0 0 0 5 2.75V2.5a.5.5 0 0 0-.5-.5M3 5.43c0-.68.41-1.28 1-1.55v3.26c-.61-.3-1-.93-1-1.61zm2 6.8V8.69l.34.16c.65.29 1.06.93 1.06 1.63v.09c0 .84-.6 1.53-1.4 1.68M9.07 9A7 7 0 0 1 9 8h-.5a.5.5 0 0 1 0-1h.57c.13-.94.45-1.8.91-2.47C10.6 3.63 11.5 3 12.56 3c.4 0 .85.12 1.22.36a.5.5 0 0 1-.56.83 1.2 1.2 0 0 0-.66-.19c-.63 0-1.26.38-1.75 1.1q-.53.78-.73 1.91h.42a.5.5 0 0 1 0 1H10q0 .52.08 1h.42a.5.5 0 1 1 0 1h-.15q.18.5.46.9c.5.72 1.12 1.1 1.75 1.1q.4 0 .65-.18a.5.5 0 0 1 .58.82c-.38.26-.84.36-1.23.36-1.06 0-1.96-.63-2.58-1.54A6 6 0 0 1 9.3 10h-.8a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `currency_dollar_euro_16_filled`. */
export const FluentRefDollarFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 2a.75.75 0 0 0-.75.75v.35c-1.15.33-2 1.4-2 2.65v.04c0 1.1.65 2.1 1.67 2.55L4 8.5v2.75c-.3-.23-.5-.6-.5-1v-.6a.75.75 0 0 0-1.5 0v.6c0 1.26.85 2.32 2 2.65v.36a.75.75 0 1 0 1.5 0v-.36a2.78 2.78 0 0 0 .34-5.23L5.5 7.5V4.75c.3.23.5.6.5 1v.62a.75.75 0 1 0 1.5 0v-.62c0-1.26-.84-2.32-2-2.65v-.35A.75.75 0 0 0 4.75 2M3.5 5.75c0-.4.2-.77.5-1v2.06c-.31-.24-.5-.62-.5-1.02zm2 5.48V9.2c.31.24.5.62.5 1.03s-.2.78-.5 1.01m5-3.23h.75a.75.75 0 0 0 0-1.5h-.55q.17-.64.47-1.1c.4-.65.87-.9 1.26-.9q.22.01.38.11a.75.75 0 1 0 .88-1.2c-.38-.28-.84-.4-1.26-.4-1.09 0-1.96.69-2.53 1.59q-.52.82-.75 1.9h-.4a.75.75 0 1 0 0 1.5H9q0 .5.07 1h-.32a.75.75 0 1 0 0 1.5h.7q.19.49.45.9c.57.9 1.44 1.6 2.53 1.6.4 0 .88-.1 1.28-.41a.75.75 0 1 0-.92-1.19q-.11.1-.36.1c-.39 0-.86-.25-1.26-.9l-.06-.1h.14a.75.75 0 1 0 0-1.5h-.67a6 6 0 0 1-.08-1" />
  </svg>
);

/** Fluent `data_scatter_20_regular`. */
export const FluentRefChartScatterIcon = () => (
  <svg {...base}>
    <path d="M2.5 2c.28 0 .5.22.5.5v13c0 .83.67 1.5 1.5 1.5h13a.5.5 0 0 1 0 1h-13A2.5 2.5 0 0 1 2 15.5v-13c0-.28.22-.5.5-.5M5 7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0M7.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m7-3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M13 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m-3 7a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0m2.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
  </svg>
);

/** Fluent `data_scatter_20_filled`. */
export const FluentRefChartScatterFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 2c.41 0 .75.34.75.75v12.5c0 .69.56 1.25 1.25 1.25h12.5a.75.75 0 0 1 0 1.5H4.75A2.75 2.75 0 0 1 2 15.25V2.75c0-.41.34-.75.75-.75M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m4.5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
  </svg>
);

/** Fluent `board_split_16_regular`. */
export const FluentRefLayoutDashboardIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5V7h6V3zM3 8v3.5c0 .83.67 1.5 1.5 1.5H9V8zm7 1h3V7h-3zm3 1h-3v3h1.5c.83 0 1.5-.67 1.5-1.5zm0-5.5c0-.83-.67-1.5-1.5-1.5H10v3h3z" />
  </svg>
);

/** Fluent `board_split_16_filled`. */
export const FluentRefLayoutDashboardFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5V7h7V2zm5.5 8h4V6h-4zm4 1h-4v3h1.5a2.5 2.5 0 0 0 2.5-2.5zm0-6.5V5h-4V2h1.5A2.5 2.5 0 0 1 14 4.5M9 8H2v3.5A2.5 2.5 0 0 0 4.5 14H9z" />
  </svg>
);

/** Fluent `organization_16_regular`. */
export const FluentRefNetworkIcon = () => (
  <svg {...base}>
    <path d="M8 1a2.5 2.5 0 0 0-.5 4.95V7H5.37C4.6 7 4 7.61 4 8.37v1.68a2.5 2.5 0 1 0 1 0V8.37c0-.2.16-.37.37-.37h5.26c.2 0 .37.16.37.37v1.68a2.5 2.5 0 1 0 1 0V8.37C12 7.6 11.39 7 10.63 7H8.5V5.95A2.5 2.5 0 0 0 8 1M6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m-3.5 9a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m8.5-1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
  </svg>
);

/** Fluent `organization_16_filled`. */
export const FluentRefNetworkFilledIcon = () => (
  <svg {...base}>
    <path d="M5.5 3.5a2.5 2.5 0 1 1 3 2.45V7h2.13C11.4 7 12 7.61 12 8.37v1.68a2.5 2.5 0 1 1-1 0V8.37c0-.2-.16-.37-.37-.37H5.37c-.2 0-.37.16-.37.37v1.68a2.5 2.5 0 1 1-1 0V8.37C4 7.6 4.61 7 5.37 7H7.5V5.95a2.5 2.5 0 0 1-2-2.45" />
  </svg>
);

/** Fluent `target_16_regular`. */
export const FluentRefTargetIcon = () => (
  <svg {...base}>
    <path d="M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-5a5 5 0 1 0 0 10A5 5 0 0 0 8 3" />
  </svg>
);

/** Fluent `target_16_filled`. */
export const FluentRefTargetFilledIcon = () => (
  <svg {...base}>
    <path d="M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9" />
  </svg>
);

/** Fluent `cd_16_regular`. */
export const FluentRefDiscIcon = () => (
  <svg {...base}>
    <path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4M7 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0m1-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8" />
  </svg>
);

/** Fluent `cd_16_filled`. */
export const FluentRefDiscFilledIcon = () => (
  <svg {...base}>
    <path d="M8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0-7a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `whiteboard_16_regular`. */
export const FluentRefPresentationIcon = () => (
  <svg {...base}>
    <path d="M11.73 2.56a1.91 1.91 0 1 1 2.7 2.7L11.8 7.92q-.45.45-1.06.63l-1.46.43a1 1 0 0 1-1.25-1.24l.44-1.47q.17-.6.63-1.06zm2 .7a.9.9 0 0 0-1.3 0L9.8 5.92q-.26.27-.38.63l-.43 1.47 1.47-.43q.36-.1.64-.38l2.64-2.64a.9.9 0 0 0 0-1.3M9.87 3H3.5A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5V6.11l-1 1v3.39c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 10.5V7.27A7 7 0 0 1 3.75 6.2q.46-.16.73-.13.24.02.35.2c.13.2.13.35.05.54q-.16.35-.57.83l-.04.05c-.24.3-.54.65-.71 1.04-.2.44-.28.95 0 1.5.41.84 1.36.93 2.1.78a4.4 4.4 0 0 0 2.2-1.16.5.5 0 1 0-.71-.7c-.43.42-1.08.77-1.67.88-.62.12-.93-.04-1.03-.25q-.15-.3.01-.63.2-.39.62-.87l.01-.01c.25-.3.55-.68.72-1.08.18-.45.2-.96-.14-1.47q-.42-.59-1.07-.64c-.4-.05-.81.04-1.2.18q-.71.28-1.4.76V5.5C2 4.67 2.67 4 3.5 4h5.37z" />
  </svg>
);

/** Fluent `whiteboard_16_filled`. */
export const FluentRefPresentationFilledIcon = () => (
  <svg {...base}>
    <path d="M11.73 2.56a1.91 1.91 0 1 1 2.7 2.7L11.8 7.92q-.45.45-1.06.63l-1.46.43a1 1 0 0 1-1.25-1.24l.44-1.47q.17-.6.63-1.06zM3.5 3h6.37l-1.5 1.5a3.5 3.5 0 0 0-.87 1.48l-.43 1.47a2 2 0 0 0 2.48 2.48l1.47-.43a3.5 3.5 0 0 0 1.48-.89l2.5-2.5v4.39a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5V8.2l.35-.35a8 8 0 0 1 2.12-1.53q.58-.26.93-.26.3 0 .43.22c.13.19.13.34.05.53q-.16.35-.57.83l-.04.05c-.24.3-.54.65-.71 1.04-.2.44-.28.95 0 1.5.3.6.88.82 1.45.84s1.17-.15 1.71-.42a.5.5 0 1 0-.44-.9c-.44.22-.89.33-1.24.32s-.51-.13-.6-.3q-.14-.29.02-.62.2-.39.62-.87l.01-.01c.25-.3.55-.68.72-1.08.18-.45.2-.96-.14-1.47-.31-.46-.77-.65-1.25-.66q-.7.02-1.37.35c-.73.34-1.47.88-2.05 1.4V5.5A2.5 2.5 0 0 1 3.5 3" />
  </svg>
);

/** Fluent `apps_add_in_16_regular`. */
export const FluentRefBlocksIcon = () => (
  <svg {...base}>
    <path d="M13 1.5a.5.5 0 0 0-1 0V3h-1.5a.5.5 0 0 0 0 1H12v1.5a.5.5 0 0 0 1 0V4h1.5a.5.5 0 0 0 0-1H13zM3.75 2C2.78 2 2 2.78 2 3.75v8.5c0 .97.78 1.75 1.75 1.75h8.5c.97 0 1.75-.78 1.75-1.75v-3c0-.97-.78-1.75-1.75-1.75H8.5V3.75C8.5 2.78 7.72 2 6.75 2zM7.5 8.5V13H3.75a.75.75 0 0 1-.75-.75V8.5zm0-4.75V7.5H3V3.75c0-.41.34-.75.75-.75h3c.41 0 .75.34.75.75M12.25 13H8.5V8.5h3.75c.41 0 .75.34.75.75v3c0 .41-.34.75-.75.75" />
  </svg>
);

/** Fluent `apps_add_in_16_filled`. */
export const FluentRefBlocksFilledIcon = () => (
  <svg {...base}>
    <path d="M12.25 1c.41 0 .75.34.75.75V3h1.25a.75.75 0 0 1 0 1.5H13v1.25a.75.75 0 0 1-1.5 0V4.5h-1.25a.75.75 0 0 1 0-1.5h1.25V1.75c0-.41.34-.75.75-.75m-8.5 2.5H7c.14 0 .25.11.25.25v3.5H3.5v-3.5c0-.14.11-.25.25-.25m5 3.75v-3.5C8.75 2.78 7.97 2 7 2H3.75C2.78 2 2 2.78 2 3.75v8.5c0 .97.78 1.75 1.75 1.75h8.5c.97 0 1.75-.78 1.75-1.75V9c0-.97-.78-1.75-1.75-1.75zm-1.5 1.5v3.75h-3.5a.25.25 0 0 1-.25-.25v-3.5zm1.5 3.75V8.75h3.5q.23.02.25.25v3.25q-.02.23-.25.25z" />
  </svg>
);

/** Fluent `checkmark_starburst_16_regular`. */
export const FluentRefBadgeCheckIcon = () => (
  <svg {...base}>
    <path d="M4.1 2.25a2 2 0 0 1 2.65-1.08l.88.38q.4.15.8 0l.88-.37a2 2 0 0 1 2.64 1.1l.35.9q.16.4.56.56l.9.36a2 2 0 0 1 1.08 2.65l-.39.88a1 1 0 0 0 0 .8l.37.88a2 2 0 0 1-1.1 2.64l-.9.35a1 1 0 0 0-.56.56l-.36.9a2 2 0 0 1-2.65 1.08l-.88-.39a1 1 0 0 0-.8 0l-.88.37a2 2 0 0 1-2.64-1.1l-.35-.9a1 1 0 0 0-.56-.56l-.9-.36a2 2 0 0 1-1.08-2.65l.39-.88a1 1 0 0 0 0-.8l-.37-.88a2 2 0 0 1 1.1-2.64l.9-.35a1 1 0 0 0 .56-.56zm2.25-.17a1 1 0 0 0-1.32.54l-.37.9a2 2 0 0 1-1.11 1.1l-.9.36A1 1 0 0 0 2.1 6.3l.37.89a2 2 0 0 1 0 1.57l-.39.89a1 1 0 0 0 .54 1.32l.9.37c.5.2.9.6 1.1 1.11l.36.9a1 1 0 0 0 1.32.55l.89-.37a2 2 0 0 1 1.57 0l.89.39a1 1 0 0 0 1.32-.54l.37-.9a2 2 0 0 1 1.11-1.1l.9-.36a1 1 0 0 0 .55-1.32l-.37-.89a2 2 0 0 1 0-1.57l.39-.89a1 1 0 0 0-.54-1.32l-.9-.36a2 2 0 0 1-1.1-1.12l-.36-.9A1 1 0 0 0 9.7 2.1l-.89.37a2 2 0 0 1-1.57 0zm3.8 4.07a.5.5 0 0 1 .7.7L7.6 10.1a.5.5 0 0 1-.7 0L5.15 8.35a.5.5 0 0 1 .7-.7l1.4 1.4z" />
  </svg>
);

/** Fluent `checkmark_starburst_16_filled`. */
export const FluentRefBadgeCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M4.1 2.25a2 2 0 0 1 2.65-1.08l.88.38c.25.11.54.11.79 0l.89-.37a2 2 0 0 1 2.64 1.1l.35.9q.16.4.56.56l.9.36a2 2 0 0 1 1.07 2.65l-.38.89a1 1 0 0 0 0 .78l.37.9a2 2 0 0 1-1.1 2.63l-.9.35a1 1 0 0 0-.56.56l-.36.9a2 2 0 0 1-2.65 1.08l-.88-.39a1 1 0 0 0-.8 0l-.88.37a2 2 0 0 1-2.64-1.1l-.35-.9a1 1 0 0 0-.56-.56l-.9-.36a2 2 0 0 1-1.07-2.65l.38-.88a1 1 0 0 0 0-.79l-.37-.89a2 2 0 0 1 1.1-2.64l.9-.35a1 1 0 0 0 .56-.55zm6.75 3.9a.5.5 0 0 0-.7 0l-2.9 2.9-1.4-1.4a.5.5 0 0 0-.7.7L6.9 10.1c.2.2.5.2.7 0l3.25-3.25a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `cookies_16_regular`. */
export const FluentRefCookieIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 0 1 8.02-6.93.5.5 0 0 1 .34.79Q9.01 2.35 9 3a2 2 0 0 0 1.63 1.97c.2.03.37.2.4.4a2 2 0 0 0 3.11 1.27.5.5 0 0 1 .79.34q.06.5.07 1.02A7 7 0 1 1 1 8m7-6a6 6 0 1 0 6 5.83 3 3 0 0 1-3.87-1.96A3 3 0 0 1 8.17 2zm.75 6a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-3.5 3.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m.25-5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M9.75 12a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `cookies_16_filled`. */
export const FluentRefCookieFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 0 6.93 5.98.5.5 0 0 0-.79-.34q-.49.35-1.14.36a2 2 0 0 1-1.97-1.63.5.5 0 0 0-.4-.4 2 2 0 0 1-1.27-3.11.5.5 0 0 0-.34-.79A7 7 0 0 0 8 1m0 7.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m-2 2a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M4.75 7a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m5.75 4.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" />
  </svg>
);

/** Fluent `movies_and_tv_16_regular`. */
export const FluentRefClapperboardIcon = () => (
  <svg {...base}>
    <path d="M13.22 4.25 7.09 6.24a1 1 0 0 1-.24.08L4.75 7h8.75c.28 0 .5.22.5.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-5q0-.15.09-.29l-.2-.6A2.5 2.5 0 0 1 3.5 3.46l6.66-2.16a2.5 2.5 0 0 1 3.15 1.6l.23.72a.5.5 0 0 1-.32.63m-3.75.16 1.29-2.23-.3.07-1.24.4-1.3 2.27zm2.3-1.98-.02.04-.85 1.48 1.53-.5-.07-.24a1.5 1.5 0 0 0-.6-.78m-3.97.69-1.56.5-1.3 2.27 1.55-.51zM2.92 6.54l.59-.2 1.3-2.26-1 .33a1.5 1.5 0 0 0-.96 1.9zM3 8v4.5c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V8z" />
  </svg>
);

/** Fluent `movies_and_tv_16_filled`. */
export const FluentRefClapperboardFilledIcon = () => (
  <svg {...base}>
    <path d="M13.22 4.25 7.09 6.24a1 1 0 0 1-.24.08L4.75 7h8.75c.28 0 .5.22.5.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-5q0-.15.09-.29l-.2-.6A2.5 2.5 0 0 1 3.5 3.46l6.66-2.16a2.5 2.5 0 0 1 3.15 1.6l.23.72a.5.5 0 0 1-.32.63m-3.75.16 1.29-2.23-.3.07-1.24.4-1.3 2.27zm2.3-1.98-.02.04-.85 1.48 1.53-.5-.07-.24a1.5 1.5 0 0 0-.6-.78m-3.97.69-1.56.5-1.3 2.27 1.55-.51zM2.92 6.54l.59-.2 1.3-2.26-1 .33a1.5 1.5 0 0 0-.96 1.9z" />
  </svg>
);

/** Fluent `vault_16_regular`. */
export const FluentRefVaultIcon = () => (
  <svg {...base}>
    <path d="M4.5 6c.28 0 .5.22.5.5v3a.5.5 0 0 1-1 0v-3c0-.28.22-.5.5-.5m7 2q0 .35-.15.65l.5.5a.5.5 0 0 1-.7.7l-.5-.5a1.5 1.5 0 0 1-1.3 0l-.5.5a.5.5 0 0 1-.7-.7l.5-.5a1.5 1.5 0 0 1 0-1.3l-.5-.5a.5.5 0 1 1 .7-.7l.5.5a1.5 1.5 0 0 1 1.3 0l.5-.5a.5.5 0 0 1 .7.7l-.5.5q.15.3.15.65m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM3.5 4C2.67 4 2 4.67 2 5.5v5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `vault_16_filled`. */
export const FluentRefVaultFilledIcon = () => (
  <svg {...base}>
    <path d="M10 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-9-3A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zm3.5.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-.5-.5m6.85 2.65a1.5 1.5 0 0 0 0-1.3l.5-.5a.5.5 0 0 0-.7-.7l-.5.5a1.5 1.5 0 0 0-1.3 0l-.5-.5a.5.5 0 1 0-.7.7l.5.5a1.5 1.5 0 0 0 0 1.3l-.5.5a.5.5 0 1 0 .7.7l.5-.5a1.5 1.5 0 0 0 1.3 0l.5.5a.5.5 0 0 0 .7-.7z" />
  </svg>
);

/** Fluent `bug_prohibited_20_regular`. */
export const FluentRefBugOffIcon = () => (
  <svg {...base}>
    <path d="M9.18 15.87q.15.57.4 1.09A4 4 0 0 1 6 13h-.5A1.5 1.5 0 0 0 4 14.5v2a.5.5 0 0 1-1 0v-2A2.5 2.5 0 0 1 5.5 12H6v-1.5H2.5a.5.5 0 0 1 0-1H6V8h-.5A2.5 2.5 0 0 1 3 5.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 0 5.5 7H6a3 3 0 0 1 2.31-2.92A2 2 0 0 1 8 3v-.5a.5.5 0 0 1 1 0V3a1 1 0 0 0 2 0v-.5a.5.5 0 0 1 1 0V3a2 2 0 0 1-.31 1.08A3 3 0 0 1 14 7h.5A1.5 1.5 0 0 0 16 5.5v-2a.5.5 0 0 1 1 0v2A2.5 2.5 0 0 1 14.5 8H14v1.03q-.5.04-1 .18V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a3 3 0 0 0 2.18 2.87M19 14.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-7.3 2.1 4.9-4.9a3.5 3.5 0 0 0-4.57.33 3.5 3.5 0 0 0-.33 4.57m6.3-2.1c0-.76-.24-1.5-.7-2.1l-4.9 4.9a3.5 3.5 0 0 0 4.57-.33A3.5 3.5 0 0 0 18 14.5" />
  </svg>
);

/** Fluent `bug_prohibited_20_filled`. */
export const FluentRefBugOffFilledIcon = () => (
  <svg {...base}>
    <path d="M14.5 10a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9M11 14.5a3.5 3.5 0 0 1 5.6-2.8l-4.9 4.9c-.46-.6-.7-1.34-.7-2.1m3.5 3.5c-.76 0-1.5-.24-2.1-.7l4.9-4.9a3.5 3.5 0 0 1-.33 4.57A3.5 3.5 0 0 1 14.5 18M17 3.5a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 1 14.5 7H14a3 3 0 0 0-2.31-2.92A2 2 0 0 0 12 3v-.5a.5.5 0 0 0-1 0V3a1 1 0 0 1-2 0v-.5a.5.5 0 1 0-1 0V3q0 .59.31 1.08A3 3 0 0 0 6 7h-.5A1.5 1.5 0 0 1 4 5.5v-2a.5.5 0 1 0-1 0v2A2.5 2.5 0 0 0 5.5 8H6v1.5H2.5a.5.5 0 1 0 0 1H6V12h-.5A2.5 2.5 0 0 0 3 14.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 1 5.5 13H6a4 4 0 0 0 3.59 3.96 5.5 5.5 0 0 1 .85-6.17A5.5 5.5 0 0 1 14 9.03V8h.5A2.5 2.5 0 0 0 17 5.5z" />
  </svg>
);

/** Fluent `document_lock_16_regular`. */
export const FluentRefFileLockIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.4q.45-.26 1-.36V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1h-2a2 2 0 0 1-.27 1H12a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06l-2.91-2.91A1.5 1.5 0 0 0 9.59 1zm6.8 4h-2.3a.5.5 0 0 1-.5-.5V2.2zM3.5 8v1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.5V8a2 2 0 1 0-4 0m1 1V8a1 1 0 0 1 2 0v1zm1 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `document_lock_16_filled`. */
export const FluentRefFileLockFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1v3.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5H9.73a2 2 0 0 0 .27-1v-4a2 2 0 0 0-1.5-1.94V8A3 3 0 0 0 4 5.4V2.5C4 1.67 4.67 1 5.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zM3.5 8v1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.5V8a2 2 0 1 0-4 0m1 1V8a1 1 0 0 1 2 0v1zm1 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `folder_multiple_16_regular`. */
export const FluentRefFoldersIcon = () => (
  <svg {...base}>
    <path d="M3.5 3C2.67 3 2 3.67 2 4.5V5h3.09a.5.5 0 0 0 .35-.15L6.29 4l-.85-.85A.5.5 0 0 0 5.09 3zM1 4.44V4.4A2.5 2.5 0 0 1 3.5 2h1.59c.4 0 .78.16 1.06.44L7.2 3.5h3.29A2.5 2.5 0 0 1 13 6v3.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 1 9.5zm6.2.06L6.16 5.56A1.5 1.5 0 0 1 5.09 6H2v3.5c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V6c0-.83-.67-1.5-1.5-1.5zM14 6c.6.46 1 1.18 1 2v1.5a4.5 4.5 0 0 1-4.5 4.5h-5a2.5 2.5 0 0 1-2-1h7A3.5 3.5 0 0 0 14 9.5z" />
  </svg>
);

/** Fluent `folder_multiple_16_filled`. */
export const FluentRefFoldersFilledIcon = () => (
  <svg {...base}>
    <path d="m6.15 2.44.85.85-1.56 1.56a.5.5 0 0 1-.35.15H1v-.5A2.5 2.5 0 0 1 3.5 2h1.59c.4 0 .78.16 1.06.44M1 9.5V6h4.09c.4 0 .78-.16 1.06-.44L8.2 3.5h2.29A2.5 2.5 0 0 1 13 6v3.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 1 9.5M14 6v3.5a3.5 3.5 0 0 1-3.5 3.5h-7c.46.6 1.18 1 2 1h5A4.5 4.5 0 0 0 15 9.5V8c0-.82-.4-1.54-1-2" />
  </svg>
);

/** Fluent `comment_error_16_regular`. */
export const FluentRefChatWarningIcon = () => (
  <svg {...base}>
    <path d="M5.6 3H3.5C2.67 3 2 3.67 2 4.5v5c0 .83.67 1.5 1.5 1.5H5v2.9L8.31 11h4.19a1.5 1.5 0 0 0 1.48-1.24q.59-.48 1.02-1.1v.84a2.5 2.5 0 0 1-2.5 2.5H8.69l-3.06 2.68A.98.98 0 0 1 4 13.94V12h-.5A2.5 2.5 0 0 1 1 9.5v-5A2.5 2.5 0 0 1 3.5 2h2.76q-.39.46-.66 1m4.9 7a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M10 3.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0zm1.13 4a.62.62 0 1 1-1.25 0 .62.62 0 0 1 1.24 0" />
  </svg>
);

/** Fluent `comment_error_16_filled`. */
export const FluentRefChatWarningFilledIcon = () => (
  <svg {...base}>
    <path d="M15 8.66A5.5 5.5 0 1 1 6.26 2H3.5A2.5 2.5 0 0 0 1 4.5v5A2.5 2.5 0 0 0 3.5 12H4v1.94c0 .84 1 1.3 1.63.74L8.69 12h3.81A2.5 2.5 0 0 0 15 9.5zM10.5 10a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M10 3.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0zm1.13 4a.62.62 0 1 1-1.25 0 .62.62 0 0 1 1.24 0" />
  </svg>
);

/** Fluent `call_inbound_16_regular`. */
export const FluentRefCallIncomingIcon = () => (
  <svg {...base}>
    <path d="M13.85 2.15c.2.2.2.5 0 .7L10.71 6h1.8a.5.5 0 1 1 0 1H9.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.8l3.15-3.15c.2-.2.5-.2.7 0m-9.48-.03c.86-.32 1.81.06 2.2.89l.58 1.22a1.5 1.5 0 0 1-.19 1.6l-.94 1.16A4.2 4.2 0 0 0 7.37 9.3l1.5-.27c.5-.1 1.01.07 1.36.44l.8.84c.68.7.65 1.82-.05 2.48l-.3.28c-1.13 1.06-2.88 1.3-4.13.25a14 14 0 0 1-2.92-3.21 12 12 0 0 1-1.59-4.55 3.1 3.1 0 0 1 2.07-3.34zm2.87 7.72-.3.4-.13-.1A5 5 0 0 1 4.99 6.9V6.9l.5-.06-.5.05a.5.5 0 0 1 .11-.36L6.2 5.19a.5.5 0 0 0 .06-.53l-.58-1.22a.75.75 0 0 0-.94-.38l-.27.1c-.98.36-1.58 1.28-1.43 2.24.2 1.26.6 2.86 1.44 4.17a13 13 0 0 0 2.72 2.98c.8.67 1.98.57 2.8-.2l.3-.28c.3-.3.32-.77.03-1.07l-.81-.84a.5.5 0 0 0-.45-.15l-1.73.32a.5.5 0 0 1-.38-.08z" />
  </svg>
);

/** Fluent `call_inbound_16_filled`. */
export const FluentRefCallIncomingFilledIcon = () => (
  <svg {...base}>
    <path d="M13.85 2.15c.2.2.2.5 0 .7L10.71 6h1.8a.5.5 0 1 1 0 1H9.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.8l3.15-3.15c.2-.2.5-.2.7 0m-9.48-.03c.86-.32 1.81.06 2.2.89l.57 1.19c.26.55.16 1.2-.25 1.65L5.57 7.3a5 5 0 0 0 1.35 2.29l1.88-.5a1.5 1.5 0 0 1 1.46.42l.78.8c.67.71.64 1.83-.06 2.5l-.3.27c-1.13 1.06-2.88 1.3-4.13.25a14 14 0 0 1-2.92-3.21 12 12 0 0 1-1.59-4.55 3.1 3.1 0 0 1 2.07-3.34zm0 0 .18.47Z" />
  </svg>
);

/** Fluent `call_outbound_16_regular`. */
export const FluentRefCallOutgoingIcon = () => (
  <svg {...base}>
    <path d="M10 2.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v3a.5.5 0 1 1-1 0V3.7L9.85 6.86a.5.5 0 0 1-.7-.7L12.29 3H10.5a.5.5 0 0 1-.5-.5m-5.63-.38c.86-.32 1.81.06 2.2.89l.58 1.22a1.5 1.5 0 0 1-.19 1.6l-.94 1.16A4 4 0 0 0 7.37 9.3l1.5-.27c.5-.1 1.01.07 1.36.44l.8.84c.68.7.65 1.82-.05 2.48l-.3.28c-1.13 1.06-2.88 1.3-4.13.25a14 14 0 0 1-2.92-3.21 12 12 0 0 1-1.59-4.55 3.1 3.1 0 0 1 2.07-3.34zm2.87 7.72-.3.4-.13-.1A5 5 0 0 1 4.99 6.9V6.9l.5-.06-.5.05a.5.5 0 0 1 .11-.36L6.2 5.19a.5.5 0 0 0 .06-.53l-.58-1.22a.75.75 0 0 0-.94-.38l-.27.1c-.98.36-1.58 1.28-1.43 2.24.2 1.26.6 2.86 1.44 4.17a13 13 0 0 0 2.72 2.98c.8.67 1.98.57 2.8-.2l.3-.28c.3-.3.32-.77.03-1.07l-.81-.84a.5.5 0 0 0-.45-.15l-1.73.32a.5.5 0 0 1-.38-.08z" />
  </svg>
);

/** Fluent `call_outbound_16_filled`. */
export const FluentRefCallOutgoingFilledIcon = () => (
  <svg {...base}>
    <path d="M10.5 2a.5.5 0 0 0 0 1h1.8L9.14 6.15a.5.5 0 1 0 .7.7L13 3.71V5.5a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-.5-.5zM6.57 3a1.75 1.75 0 0 0-2.2-.88l-.26.1a3.1 3.1 0 0 0-2.07 3.34c.2 1.32.65 3.07 1.59 4.55a14 14 0 0 0 2.92 3.2c1.25 1.05 3 .82 4.13-.24l.3-.28c.7-.66.73-1.78.06-2.48l-.78-.81a1.5 1.5 0 0 0-1.46-.41l-1.88.49a4.7 4.7 0 0 1-1.35-2.29L6.9 5.85c.41-.45.5-1.1.25-1.65z" />
  </svg>
);

/** Fluent `window_16_regular`. */
export const FluentRefAppWindowIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM13 5H3v-.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5zM3 6h10v5.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `window_16_filled`. */
export const FluentRefAppWindowFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM3 6v5.5c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V6z" />
  </svg>
);

/** Fluent `text_case_uppercase_16_regular`. */
export const FluentRefCaseUpperIcon = () => (
  <svg {...base}>
    <path d="M4.5 2.5c.21 0 .4.13.47.33l3.5 9.5a.5.5 0 0 1-.94.34L6.55 10h-4.1l-.98 2.67a.5.5 0 0 1-.94-.34l3.5-9.5a.5.5 0 0 1 .47-.33m0 1.95L2.82 9h3.36zm5-1.95A.5.5 0 0 0 9 3v9.5c0 .28.22.5.5.5H12a3 3 0 0 0 1.16-5.77 2.74 2.74 0 0 0-1.91-4.73zM13 5.25C13 6.22 12.22 7 11.25 7H10V3.5h1.25c.97 0 1.75.78 1.75 1.75M12 12h-2V8h2a2 2 0 1 1 0 4" />
  </svg>
);

/** Fluent `text_case_uppercase_16_filled`. */
export const FluentRefCaseUpperFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2.25c.31 0 .6.2.7.5l3.5 9.5a.75.75 0 0 1-1.4.5l-.93-2.5H2.63l-.93 2.5a.75.75 0 1 1-1.4-.5l3.5-9.5c.1-.3.39-.5.7-.5m0 2.92L3.18 8.75h2.64zm5.25-2.92A.75.75 0 0 0 9 3v9.5c0 .41.34.75.75.75h2.5a3.25 3.25 0 0 0 1.57-6.1 3 3 0 0 0-2.32-4.9zm3.25 3c0 .83-.67 1.5-1.5 1.5h-1v-3h1c.83 0 1.5.67 1.5 1.5m-.75 6.5H10.5v-3.5h1.75a1.75 1.75 0 1 1 0 3.5" />
  </svg>
);

/** Fluent `text_case_title_16_regular`. */
export const FluentRefCaseSensitiveIcon = () => (
  <svg {...base}>
    <path d="M5 2.5c.21 0 .4.13.47.33l3.5 9.5a.5.5 0 0 1-.94.34L7.05 10h-4.1l-.98 2.67a.5.5 0 0 1-.94-.34l3.5-9.5A.5.5 0 0 1 5 2.5m0 1.95L3.32 9h3.36zm5.5-1.95c.28 0 .5.22.5.5v4.6q.64-.58 1.5-.6c1.38 0 2.5 1.34 2.5 3s-1.12 3-2.5 3q-.86-.02-1.5-.6v.1a.5.5 0 0 1-1 0V3c0-.28.22-.5.5-.5m2 9.5c.67 0 1.5-.72 1.5-2s-.83-2-1.5-2-1.5.72-1.5 2 .83 2 1.5 2" />
  </svg>
);

/** Fluent `text_case_title_16_filled`. */
export const FluentRefCaseSensitiveFilledIcon = () => (
  <svg {...base}>
    <path d="M5.7 2.74a.75.75 0 0 0-1.4 0l-3.5 9.5a.75.75 0 0 0 1.4.52l.93-2.51h3.74l.93 2.5a.75.75 0 1 0 1.4-.5zm.62 6.01H3.68L5 5.17zm4.18-6.5c.41 0 .75.34.75.75v4.3q.5-.3 1.1-.3c1.44 0 2.6 1.4 2.6 3.13 0 1.72-1.16 3.12-2.6 3.12q-.66 0-1.21-.36a.75.75 0 0 1-1.39-.39V3c0-.41.34-.75.75-.75m.75 7.88c0 1.16.74 1.62 1.1 1.62s1.1-.46 1.1-1.62-.73-1.63-1.1-1.63c-.36 0-1.1.46-1.1 1.63" />
  </svg>
);

/** Fluent `wrench_16_regular`. */
export const FluentRefWrenchIcon = () => (
  <svg {...base}>
    <path d="M7 5a4 4 0 0 1 5.45-3.73.5.5 0 0 1 .17.82L10.7 4 12 5.3l1.91-1.92a.5.5 0 0 1 .82.17 4 4 0 0 1-4.83 5.3l-5 5.07a1.99 1.99 0 0 1-2.85-2.77L7.1 5.9Q7 5.46 7 5m4-3a3 3 0 0 0-2.86 3.9.5.5 0 0 1-.12.5l-5.25 5.44a.99.99 0 0 0 1.41 1.38l5.23-5.3a.5.5 0 0 1 .53-.11 3 3 0 0 0 4.05-3.09l-1.64 1.63a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 0-.7L11.28 2z" />
  </svg>
);

/** Fluent `wrench_16_filled`. */
export const FluentRefWrenchFilledIcon = () => (
  <svg {...base}>
    <path d="M11 1a4 4 0 0 0-3.9 4.91l-5.05 5.24a1.99 1.99 0 0 0 2.85 2.77l5-5.07a4 4 0 0 0 5.06-4.39.5.5 0 0 0-.85-.28L12 6.29 9.7 4l2.12-2.12a.5.5 0 0 0-.29-.84z" />
  </svg>
);

/** Fluent `brain_16_regular`. */
export const FluentRefBrainIcon = () => (
  <svg {...base}>
    <path d="M9.75 1c1.17 0 2.14.9 2.24 2.05a2.5 2.5 0 0 1 1.18 4.3 2.96 2.96 0 0 1-.2 5.54A2.5 2.5 0 0 1 10.5 15h-.25c-.93 0-1.75-.46-2.25-1.17-.5.7-1.32 1.17-2.25 1.17H5.5a2.5 2.5 0 0 1-2.47-2.11 2.96 2.96 0 0 1-.2-5.54A2.49 2.49 0 0 1 4 3.05 2.25 2.25 0 0 1 8 1.84 2.3 2.3 0 0 1 9.75 1m-3.5 1C5.56 2 5 2.56 5 3.25v.25a.5.5 0 0 1-.5.5 1.5 1.5 0 1 0 0 3 .5.5 0 0 1 .08 1l-.94.15a1.96 1.96 0 0 0-.16 3.83l.14.03a.5.5 0 0 1 .38.49c0 .83.67 1.5 1.5 1.5h.25c.97 0 1.75-.78 1.75-1.75v-9C7.5 2.56 6.94 2 6.25 2m3.5 0c-.69 0-1.25.56-1.25 1.25v9c0 .97.78 1.75 1.75 1.75h.25c.83 0 1.5-.67 1.5-1.5a.5.5 0 0 1 .38-.49l.14-.03a1.96 1.96 0 0 0-.16-3.83L11.42 8A.5.5 0 0 1 11.5 7a1.5 1.5 0 0 0 0-3 .5.5 0 0 1-.5-.5v-.25C11 2.56 10.44 2 9.75 2" />
  </svg>
);

/** Fluent `brain_16_filled`. */
export const FluentRefBrainFilledIcon = () => (
  <svg {...base}>
    <path d="M6.25 1q.7.01 1.25.38v12.99q-.73.62-1.75.63H5.5a2.5 2.5 0 0 1-2.47-2.11 2.96 2.96 0 0 1-.2-5.54A2.49 2.49 0 0 1 4 3.05 2.25 2.25 0 0 1 6.25 1m3.5 0c1.17 0 2.14.9 2.24 2.05a2.5 2.5 0 0 1 1.18 4.3 2.96 2.96 0 0 1-.2 5.54A2.5 2.5 0 0 1 10.5 15h-.25c-.67 0-1.27-.24-1.75-.63V1.38q.55-.37 1.25-.38" />
  </svg>
);

/** Fluent `brain_16_regular`. */
export const FluentRefBrainOffIcon = () => (
  <svg {...base}>
    <path d="M9.75 1c1.17 0 2.14.9 2.24 2.05a2.5 2.5 0 0 1 1.18 4.3 2.96 2.96 0 0 1-.2 5.54A2.5 2.5 0 0 1 10.5 15h-.25c-.93 0-1.75-.46-2.25-1.17-.5.7-1.32 1.17-2.25 1.17H5.5a2.5 2.5 0 0 1-2.47-2.11 2.96 2.96 0 0 1-.2-5.54A2.49 2.49 0 0 1 4 3.05 2.25 2.25 0 0 1 8 1.84 2.3 2.3 0 0 1 9.75 1m-3.5 1C5.56 2 5 2.56 5 3.25v.25a.5.5 0 0 1-.5.5 1.5 1.5 0 1 0 0 3 .5.5 0 0 1 .08 1l-.94.15a1.96 1.96 0 0 0-.16 3.83l.14.03a.5.5 0 0 1 .38.49c0 .83.67 1.5 1.5 1.5h.25c.97 0 1.75-.78 1.75-1.75v-9C7.5 2.56 6.94 2 6.25 2m3.5 0c-.69 0-1.25.56-1.25 1.25v9c0 .97.78 1.75 1.75 1.75h.25c.83 0 1.5-.67 1.5-1.5a.5.5 0 0 1 .38-.49l.14-.03a1.96 1.96 0 0 0-.16-3.83L11.42 8A.5.5 0 0 1 11.5 7a1.5 1.5 0 0 0 0-3 .5.5 0 0 1-.5-.5v-.25C11 2.56 10.44 2 9.75 2" />
  </svg>
);

/** Fluent `brain_16_filled`. */
export const FluentRefBrainOffFilledIcon = () => (
  <svg {...base}>
    <path d="M6.25 1q.7.01 1.25.38v12.99q-.73.62-1.75.63H5.5a2.5 2.5 0 0 1-2.47-2.11 2.96 2.96 0 0 1-.2-5.54A2.49 2.49 0 0 1 4 3.05 2.25 2.25 0 0 1 6.25 1m3.5 0c1.17 0 2.14.9 2.24 2.05a2.5 2.5 0 0 1 1.18 4.3 2.96 2.96 0 0 1-.2 5.54A2.5 2.5 0 0 1 10.5 15h-.25c-.67 0-1.27-.24-1.75-.63V1.38q.55-.37 1.25-.38" />
  </svg>
);

/** Fluent `emoji_add_16_regular`. */
export const FluentRefSmilePlusIcon = () => (
  <svg {...base}>
    <path d="M13 7a6 6 0 1 0-5.75 6 5 5 0 0 1-.22-1H7a5 5 0 1 1 5-5v.03q.51.06 1 .22zm-5.89 3.5q.13-.55.38-1.05a2.5 2.5 0 0 1-2.35-.78.5.5 0 0 0-.75.66 3.5 3.5 0 0 0 2.72 1.17M6 6a.75.75 0 1 1-1.5 0A.75.75 0 0 1 6 6m2.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M15 11.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `emoji_add_16_filled`. */
export const FluentRefSmilePlusFilledIcon = () => (
  <svg {...base}>
    <path d="M7 13h.25a4.5 4.5 0 0 1-.14-2.5A3.5 3.5 0 0 1 4.4 9.33a.5.5 0 0 1 .75-.66 2.5 2.5 0 0 0 2.35.78 4.5 4.5 0 0 1 5.5-2.2L13 7a6 6 0 1 0-6 6M5.25 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m3.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M15 11.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3-2a.5.5 0 0 0-1 0V11H9.5a.5.5 0 0 0 0 1H11v1.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H12z" />
  </svg>
);

/** Fluent `person_chat_16_regular`. */
export const FluentRefPersonChatIcon = () => (
  <svg {...base}>
    <path d="m7.6 13.27-.21.7C4.62 13.73 3 11.84 3 10v-.5C3 8.67 3.67 8 4.5 8h4.54a4 4 0 0 0-1.01 1H4.5a.5.5 0 0 0-.5.5v.5c0 1.34 1.24 2.78 3.48 2.98zM8 1.5A2.75 2.75 0 1 1 8 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 8 6a1.75 1.75 0 0 0 0-3.5m7 9a3.5 3.5 0 0 1-5.2 3.06L8.41 15a.32.32 0 0 1-.4-.4l.43-1.4A3.5 3.5 0 1 1 15 11.5M10.5 10a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm-.5 2.5c0 .28.22.5.5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `person_chat_16_filled`. */
export const FluentRefPersonChatFilledIcon = () => (
  <svg {...base}>
    <path d="m7.6 13.27-.21.7C4.62 13.73 3 11.84 3 10v-.5C3 8.67 3.67 8 4.5 8h4.54a4.3 4.3 0 0 0-1.44 5.27M8 1.5A2.75 2.75 0 1 1 8 7a2.75 2.75 0 0 1 0-5.5m7 10a3.5 3.5 0 0 1-5.2 3.06L8.41 15a.32.32 0 0 1-.4-.4l.43-1.4A3.5 3.5 0 1 1 15 11.5M10.5 10a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm-.5 2.5c0 .28.22.5.5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `dumbbell_16_regular`. */
export const FluentRefDumbbellIcon = () => (
  <svg {...base}>
    <path d="M12.03 5.78a.5.5 0 0 0 0-.71l-1.1-1.1a.5.5 0 1 0-.7.7l1.1 1.1c.2.2.5.2.7 0m-5.88 5.17a.5.5 0 1 1-.7.71l-1.1-1.1a.5.5 0 1 1 .7-.7zm8.11-9.2a1.34 1.34 0 0 0-1.89 0l-.49.5-.16-.17a1.67 1.67 0 0 0-2.55.22 2.03 2.03 0 0 0-1.82 3.43l.52.53-1.61 1.6-.53-.51A2.04 2.04 0 0 0 2.3 9.18a1.68 1.68 0 0 0-.22 2.54l.16.16-.5.5a1.34 1.34 0 0 0 1.89 1.9l.5-.5.17.16a1.67 1.67 0 0 0 2.54-.22 2.03 2.03 0 0 0 1.83-3.44l-.52-.52 1.61-1.61.52.52a2.04 2.04 0 0 0 3.44-1.83 1.67 1.67 0 0 0 .22-2.54l-.17-.16.5-.5c.51-.52.51-1.36 0-1.89m-1.2 1.68-.47-.48.49-.49a.34.34 0 0 1 .48.48zm-4 4.01L7.43 9.05l-.48-.47 1.62-1.62zm-5.63 5.63-.5.5a.34.34 0 0 1-.48-.48l.5-.5zm6.63-10.28a.67.67 0 0 1 .95 0L13.23 5a.67.67 0 0 1-.26 1.1.5.5 0 0 0-.3.69 1.04 1.04 0 0 1-1.68 1.16L8.05 5.03a1.04 1.04 0 0 1 1.17-1.68.5.5 0 0 0 .68-.3q.05-.15.16-.26m-6.5 5.26c.4-.4 1.06-.4 1.47 0L7.96 11a1.04 1.04 0 0 1-1.16 1.68.5.5 0 0 0-.68.3.67.67 0 0 1-1.1.26l-2.23-2.22a.67.67 0 0 1 .26-1.1.5.5 0 0 0 .3-.7c-.17-.38-.1-.84.21-1.16" />
  </svg>
);

/** Fluent `dumbbell_16_filled`. */
export const FluentRefDumbbellFilledIcon = () => (
  <svg {...base}>
    <path d="M11.75 2.04a1.72 1.72 0 0 0-2.6.2 2.08 2.08 0 0 0-1.84 3.53l.88.88-.84.83 1.19 1.18.83-.83.88.88a2.09 2.09 0 0 0 3.53-1.85l.2-.16c.66-.68.66-1.76 0-2.44l-.53-.51.46-.46a.84.84 0 0 0-1.19-1.18l-.45.45zm.28 3.74a.5.5 0 0 1-.7 0l-1.1-1.1a.5.5 0 0 1 .7-.71l1.1 1.1c.2.2.2.51 0 .7M2.82 7.3a2.1 2.1 0 0 1 2.95 0l2.94 2.94a2.09 2.09 0 0 1-1.85 3.53l-.16.2c-.68.66-1.76.66-2.44 0l-.51-.53-.47.47a.84.84 0 1 1-1.19-1.18l.47-.47-.52-.52a1.72 1.72 0 0 1 .2-2.6c-.12-.65.08-1.34.58-1.84m2.6 4.38-1.1-1.1a.5.5 0 0 0-.72.7l1.1 1.1a.5.5 0 0 0 .72-.7" />
  </svg>
);

/** Fluent `food_16_regular`. */
export const FluentRefUtensilsIcon = () => (
  <svg {...base}>
    <path d="M1.34 1.96c.16-.6.7-.96 1.27-.96q.55.01.93.35a1.5 1.5 0 0 1 1.92 0q.38-.34.93-.35c.57 0 1.11.36 1.27.96.15.57.34 1.5.34 2.54a3.5 3.5 0 0 1-1.6 2.94c-.27.17-.4.4-.4.6v.46l.28 2.12c.1.94.22 1.96.22 2.38a2 2 0 1 1-4 0c0-.42.11-1.44.22-2.38L3 8.43v-.4c0-.19-.13-.42-.4-.6A3.5 3.5 0 0 1 1 4.5c0-1.05.19-1.97.34-2.54M6 5a.5.5 0 0 1-1 0V2.5a.5.5 0 0 0-1 0V5a.5.5 0 0 1-1 0V2.39A.4.4 0 0 0 2.61 2c-.16 0-.27.1-.3.22A9 9 0 0 0 2 4.5c0 .88.45 1.65 1.14 2.1.44.28.86.78.86 1.44v.4l-.01.2c-.04.24-.16 1.15-.27 2.1-.12.97-.22 1.92-.22 2.26a1 1 0 1 0 2 0c0-.34-.1-1.3-.22-2.26L5 8.44v-.4c0-.66.42-1.16.86-1.44A2.5 2.5 0 0 0 7 4.5a9 9 0 0 0-.3-2.28C6.65 2.1 6.54 2 6.38 2a.4.4 0 0 0-.39.39zm3 .5A4.5 4.5 0 0 1 13.5 1c.28 0 .5.22.5.5v5.97l.02.18.23 2.24c.12 1.26.25 2.66.25 3.11a2 2 0 1 1-4 0c0-.45.13-1.85.25-3.11l.17-1.7.02-.19H10a1 1 0 0 1-1-1zm3 2.05-.02.2-.23 2.24A56 56 0 0 0 11.5 13a1 1 0 1 0 2 0c0-.38-.12-1.72-.25-3.01l-.23-2.24-.02-.2V2.04c-1.7.24-3 1.7-3 3.46V7h1.5a.5.5 0 0 1 .5.55" />
  </svg>
);

/** Fluent `food_16_filled`. */
export const FluentRefUtensilsFilledIcon = () => (
  <svg {...base}>
    <path d="M6.72 1.05q.23.13.27.34c.02.08.51 2.2.51 3.61a3 3 0 0 1-1.13 2.35q-.37.3-.37.6v.55l.28 2.12c.1.94.22 1.96.22 2.38a2 2 0 1 1-4 0c0-.42.11-1.44.22-2.38L3 8.43v-.48q0-.3-.37-.6A3 3 0 0 1 1.5 5c0-1.41.49-3.52.51-3.61a.5.5 0 0 1 .5-.39c.27 0 .5.23.5.5v3a.5.5 0 1 0 .99 0v-3a.5.5 0 0 1 1 0v3.03a.5.5 0 0 0 .99-.03v-3c0-.27.23-.5.5-.5q.06-.01.23.05M9 5.5A4.5 4.5 0 0 1 13.5 1c.28 0 .5.22.5.5v5.97l.02.18.23 2.24c.12 1.26.25 2.66.25 3.11a2 2 0 1 1-4 0c0-.45.13-1.85.25-3.11l.17-1.7.02-.19H10a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `sport_basketball_20_regular`. */
export const FluentRefBasketballIcon = () => (
  <svg {...base}>
    <path d="m10 9.3 1.08-1.09a8 8 0 0 1-1.06-1.96 17 17 0 0 1-.85-3.2 7 7 0 0 0-3.75 1.66zm1.79-.38L10.71 10l4.58 4.58a7 7 0 0 0 1.66-3.75l-.42-.07c-.9-.18-1.88-.43-2.77-.78a8 8 0 0 1-1.97-1.06m5.2.9a7 7 0 0 0-1.7-4.4L12.5 8.2q.66.48 1.61.85a16 16 0 0 0 2.89.78M11.8 7.5l2.8-2.8A7 7 0 0 0 10.16 3l.06.27c.17.87.4 1.8.72 2.62.25.62.53 1.18.85 1.6M10 10.7 8.92 11.8c.44.55.79 1.25 1.06 1.96a17 17 0 0 1 .86 3.2 7 7 0 0 0 3.74-1.66zm-1.8 1.8-2.78 2.8a7 7 0 0 0 4.4 1.7q-.01-.14-.04-.27c-.18-.87-.41-1.8-.73-2.62a7 7 0 0 0-.84-1.6m-.7-.7q-.65-.49-1.61-.85A16 16 0 0 0 3 10.17c.04 1.58.61 3.15 1.7 4.41zm.71-.72L9.3 10 4.71 5.42a7 7 0 0 0-1.66 3.74l.42.08c.9.18 1.88.43 2.78.78.72.28 1.4.62 1.96 1.06m7.45 4.58A8 8 0 1 1 4.34 4.34a8 8 0 0 1 11.32 11.32" />
  </svg>
);

/** Fluent `sport_basketball_20_filled`. */
export const FluentRefBasketballFilledIcon = () => (
  <svg {...base}>
    <path d="M4.7 4A8 8 0 0 1 9 2.06q.1.66.24 1.4c.18.9.43 1.89.78 2.79.28.71.62 1.4 1.06 1.96L10 9.3zm-.7.7A8 8 0 0 0 2.06 9q.65.1 1.4.24c.9.18 1.89.43 2.79.78.71.28 1.4.62 1.96 1.06L9.29 10zm3.5 7.1q-.66-.48-1.61-.85c-.83-.31-1.75-.55-2.62-.72Q2.6 10.08 2 10c0 2.02.76 3.87 2 5.28zM4.7 16l3.5-3.5q.48.66.85 1.61c.31.83.55 1.75.72 2.62q.15.68.22 1.27a8 8 0 0 1-5.28-2m4.22-4.21L10 10.71 15.3 16a8 8 0 0 1-4.3 1.94q-.1-.66-.25-1.4c-.18-.9-.43-1.89-.77-2.79a8 8 0 0 0-1.06-1.96m7.08 3.5a8 8 0 0 0 1.94-4.3q-.66-.09-1.4-.23c-.9-.18-1.89-.43-2.79-.78a8 8 0 0 1-1.96-1.06L10.7 10zM12.5 8.2q.65.48 1.61.85c.83.32 1.75.55 2.62.72q.68.15 1.27.22c0-2.02-.76-3.87-2-5.28zM15.3 4A8 8 0 0 0 10 2q.1.6.23 1.27c.17.87.4 1.8.72 2.62q.36.96.85 1.6z" />
  </svg>
);

/** Fluent `chess_16_regular`. */
export const FluentRefChessRookIcon = () => (
  <svg {...base}>
    <path d="M5 4a2.5 2.5 0 0 1 2.43 3.06 1.5 1.5 0 0 1-.4 2.94c.16 1.2.84 1.93 1.3 2.29.36.28.67.74.67 1.28v.15c-.08.67-.6 1.2-1.28 1.27l-.15.01H2.43c-.74 0-1.35-.56-1.42-1.28L1 13.57c0-.54.3-1 .67-1.28a3.5 3.5 0 0 0 1.3-2.3 1.5 1.5 0 0 1-.4-2.93A2.5 2.5 0 0 1 5 4m4.5-3q.58.01 1 .39a1.5 1.5 0 0 1 2 0 1.5 1.5 0 0 1 1-.39h.5a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2c.07 4.14 1 5.75 1.46 6.3.25.3.54.74.54 1.27 0 .8-.64 1.43-1.43 1.43H9.53q.33-.45.43-1h3.61c.24 0 .43-.2.43-.43q0-.26-.3-.63c-.7-.82-1.7-2.8-1.7-7.44 0-.28.22-.5.5-.5h.5a1 1 0 0 0 1-1V2h-.5a.5.5 0 0 0-.5.5V3a.5.5 0 0 1-1 0V2.5a.5.5 0 0 0-.98-.1l-.01.1L11 3a.5.5 0 0 1-1 0v-.52A.5.5 0 0 0 9.5 2H9v2a1 1 0 0 0 1 1h.5c.28 0 .5.22.5.5 0 3.81-.68 5.83-1.3 6.89a3 3 0 0 0-.7-.84c.45-.9.94-2.57 1-5.55a2 2 0 0 1-2-2V2a1 1 0 0 1 1-1zM5 5a1.5 1.5 0 0 0-1.3 2.25.5.5 0 0 1-.43.75H3a.5.5 0 0 0 0 1h.5c.28 0 .5.22.5.5a4.5 4.5 0 0 1-1.71 3.58q-.3.24-.29.5v.08c.05.2.22.34.43.34h5.23q.27-.07.33-.34l.01-.09q0-.24-.29-.5A4.5 4.5 0 0 1 6 9.5c0-.28.22-.5.5-.5H7l.1-.01a.5.5 0 0 0 0-.98L7 8h-.27a.5.5 0 0 1-.43-.75q.2-.34.2-.75C6.5 5.67 5.83 5 5 5" />
  </svg>
);

/** Fluent `chess_16_filled`. */
export const FluentRefChessRookFilledIcon = () => (
  <svg {...base}>
    <path d="M5 4a2.5 2.5 0 0 1 2 4 1 1 0 0 1 0 2h-.46a3.4 3.4 0 0 0 1.69 2.3c.42.26.77.73.77 1.3 0 .78-.62 1.4-1.4 1.4H2.4A1.4 1.4 0 0 1 1 13.6c0-.57.35-1.04.77-1.3.6-.38 1.49-1.11 1.69-2.3H3a1 1 0 0 1 0-2q-.48-.64-.5-1.5A2.5 2.5 0 0 1 5 4m4-3c.28 0 .5.22.5.5v1a.5.5 0 0 0 1 0v-1c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v1a.5.5 0 0 0 1 0v-1c0-.28.22-.5.5-.5h.25c.41 0 .75.34.75.75V4a2 2 0 0 1-2 2c.07 4.14 1 5.75 1.46 6.3.25.3.54.74.54 1.27 0 .8-.64 1.43-1.43 1.43H9.53q.46-.62.47-1.43c0-.9-.48-1.6-1-2.02.45-.9.94-2.57 1-5.55a2 2 0 0 1-2-2V1.75c0-.41.34-.75.75-.75z" />
  </svg>
);

/** Fluent `headset_vr_20_regular`. */
export const FluentRefVrGogglesIcon = () => (
  <svg {...base}>
    <path d="M10.75 8a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M5.5 10a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm6.5.5c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5M8.5 3a.5.5 0 0 0-.5.5V5H5.25a3.25 3.25 0 0 0-3.24 3H1.5a.5.5 0 0 0-.5.5v3c0 .28.22.5.5.5H2v1.75C2 15.55 3.46 17 5.25 17h1.6c.87 0 1.7-.34 2.3-.95l.6-.6a.35.35 0 0 1 .5 0l.59.6c.6.6 1.44.95 2.3.95h1.61c1.8 0 3.25-1.46 3.25-3.25V12h.5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5H18a3.25 3.25 0 0 0-3.25-3H12V3.5a.5.5 0 0 0-.5-.5zM17 8.25v5.5c0 1.24-1 2.25-2.25 2.25h-1.61c-.6 0-1.17-.24-1.6-.66l-.59-.6a1.35 1.35 0 0 0-1.9 0l-.6.6c-.42.42-1 .66-1.6.66h-1.6C4.01 16 3 15 3 13.75v-5.5C3 7.01 4 6 5.25 6h9.5C15.99 6 17 7 17 8.25" />
  </svg>
);

/** Fluent `headset_vr_20_filled`. */
export const FluentRefVrGogglesFilledIcon = () => (
  <svg {...base}>
    <path d="M8 3.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V5h2.75a3.25 3.25 0 0 1 3.24 3h.51c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5H18v1.75c0 1.8-1.46 3.25-3.25 3.25h-1.61c-.86 0-1.7-.34-2.3-.95l-.6-.6a.35.35 0 0 0-.49 0l-.6.6c-.6.6-1.43.95-2.3.95h-1.6A3.25 3.25 0 0 1 2 13.75V12h-.5a.5.5 0 0 1-.5-.5v-3c0-.28.22-.5.5-.5H2c.14-1.68 1.54-3 3.25-3H8zm2 5.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5 10.5c0 .28.22.5.5.5h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0-.5.5m7.5-.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `cube_16_regular`. */
export const FluentRefCubeWireframeIcon = () => (
  <svg {...base}>
    <path d="M4.7 5.04a.5.5 0 0 0-.4.92l3.2 1.37v3.17a.5.5 0 0 0 1 0V7.33l3.2-1.37a.5.5 0 1 0-.4-.92L8 6.46zm4.38-3.66a3 3 0 0 0-2.16 0l-4.96 1.9A1.5 1.5 0 0 0 1 4.69v6.63c0 .62.38 1.18.96 1.4l4.96 1.91a3 3 0 0 0 2.16 0l4.96-1.9c.58-.23.96-.79.96-1.4V4.68a1.5 1.5 0 0 0-.96-1.4zm-1.8.93a2 2 0 0 1 1.44 0l4.96 1.9c.2.08.32.27.32.48v6.62c0 .2-.13.4-.32.47l-4.96 1.9a2 2 0 0 1-1.44 0l-4.96-1.9A.5.5 0 0 1 2 11.3V4.7c0-.21.13-.4.32-.47z" />
  </svg>
);

/** Fluent `cube_16_filled`. */
export const FluentRefCubeWireframeFilledIcon = () => (
  <svg {...base}>
    <path d="M6.92 1.38a3 3 0 0 1 2.16 0l4.96 1.9c.58.23.96.79.96 1.4v6.63a1.5 1.5 0 0 1-.96 1.4l-4.96 1.91a3 3 0 0 1-2.16 0l-4.96-1.9a1.5 1.5 0 0 1-.96-1.4V4.68c0-.62.38-1.18.96-1.4zM4.7 5.04a.5.5 0 0 0-.4.92l3.2 1.37v3.17a.5.5 0 0 0 1 0V7.33l3.2-1.37a.5.5 0 1 0-.4-.92L8 6.46z" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotAgentIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotAgentFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotBuilderIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotBuilderFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotResearcherIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotResearcherFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `hat_graduation_16_regular`. */
export const FluentRefBotScholarIcon = () => (
  <svg {...base}>
    <path d="M9.37 2.45a2.5 2.5 0 0 0-2.74 0l-5.4 3.53a.5.5 0 0 0-.23.47v4.05a.5.5 0 0 0 1 0V7.34l1 .68v3.68q0 .18.12.32v.01l.03.03.32.32q.33.32.96.74A6.6 6.6 0 0 0 8 14.2a6.6 6.6 0 0 0 4.53-1.82l.32-.32.02-.03h.01a.5.5 0 0 0 .12-.33V8.02l1.78-1.2q.21-.13.22-.42a.5.5 0 0 0-.23-.42zM12 8.7v2.8a5 5 0 0 1-.97.78c-.72.46-1.75.92-3.03.92a5.6 5.6 0 0 1-4-1.7V8.7l2.6 1.75a2.5 2.5 0 0 0 2.8 0zm-8.5 3-.38.32zm3.68-8.42a1.5 1.5 0 0 1 1.64 0L13.6 6.4 8.84 9.63a1.5 1.5 0 0 1-1.68 0L2.4 6.4z" />
  </svg>
);

/** Fluent `hat_graduation_16_filled`. */
export const FluentRefBotScholarFilledIcon = () => (
  <svg {...base}>
    <path d="M6.63 2.45a2.5 2.5 0 0 1 2.74 0l5.4 3.53a.5.5 0 0 1 .01.83L9.4 10.45a2.5 2.5 0 0 1-2.8 0L2 7.35v3.15a.5.5 0 1 1-1 0V6.45a.5.5 0 0 1 .23-.47zM3 11.5V9.23l3.04 2.05c1.18.8 2.74.8 3.92 0L13 9.23v2.27a.5.5 0 0 1-.12.32l-.38-.32.38.32v.01l-.03.03-.32.32q-.33.32-.96.74A6.6 6.6 0 0 1 8 14a6.6 6.6 0 0 1-4.53-1.82l-.32-.32-.02-.03h-.01l.38-.33-.38.32A.5.5 0 0 1 3 11.5" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotGuardIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotGuardFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotLeadIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotLeadFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotDesignerIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotDesignerFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotGeneratorIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotGeneratorFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `bot_16_regular`. */
export const FluentRefBotAutomatorIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0V2h-2C4.67 2 4 2.67 4 3.5v3C4 7.33 4.67 8 5.5 8h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-2zM5 3.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5zM4 11c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v.35c0 .95-.4 1.58-1.08 2-.7.43-1.72.65-2.92.65s-2.21-.22-2.92-.66A2.2 2.2 0 0 1 4 11.35zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zM7.25 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `bot_16_filled`. */
export const FluentRefBotAutomatorFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5V2h2c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 6.5v-3C4 2.67 4.67 2 5.5 2h2v-.5c0-.28.22-.5.5-.5M4.5 9.5c-.83 0-1.5.67-1.5 1.5v.35c0 1.3.6 2.25 1.55 2.84.93.58 2.16.81 3.45.81a6.6 6.6 0 0 0 3.45-.8A3.2 3.2 0 0 0 13 11.34V11c0-.83-.67-1.5-1.5-1.5zm2-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10.25 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `arrow_turn_down_right_20_regular`. */
export const FluentRefCornerDownRightIcon = () => (
  <svg {...base}>
    <path d="M11.15 16.85c.2.2.5.2.7 0l4-4a.5.5 0 0 0 0-.7l-4-4a.5.5 0 0 0-.7.7L14.29 12H8a2 2 0 0 1-2-2V3.5a.5.5 0 0 0-1 0V10a3 3 0 0 0 3 3h6.3l-3.15 3.15a.5.5 0 0 0 0 .7" />
  </svg>
);

/** Fluent `arrow_turn_down_right_20_filled`. */
export const FluentRefCornerDownRightFilledIcon = () => (
  <svg {...base}>
    <path d="M10.72 16.78c.3.3.77.3 1.06 0l4-4c.3-.3.3-.77 0-1.06l-4-4a.75.75 0 1 0-1.06 1.06l2.72 2.72H7A1.5 1.5 0 0 1 5.5 10V3.75a.75.75 0 0 0-1.5 0V10a3 3 0 0 0 3 3h6.44l-2.72 2.72c-.3.3-.3.77 0 1.06" />
  </svg>
);

/** Fluent `arrow_next_16_regular`. */
export const FluentRefChevronLastIcon = () => (
  <svg {...base}>
    <path d="M3.65 3.85a.5.5 0 1 1 .7-.7l4.5 4.5c.2.2.2.5 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7L7.79 8zM12 3.5a.5.5 0 0 0-1 0v9a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `arrow_next_16_filled`. */
export const FluentRefChevronLastFilledIcon = () => (
  <svg {...base}>
    <path d="M3.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 1 0-1.1 1.02L7.22 8zM11.25 3c.41 0 .75.34.75.75v8.5a.75.75 0 0 1-1.5 0v-8.5c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `location_arrow_16_regular`. */
export const FluentRefNavigationIcon = () => (
  <svg {...base}>
    <path d="M13.93 3.36a1 1 0 0 0-1.3-1.3l-10 3.85a1 1 0 0 0 .11 1.9l4.03 1.06a.5.5 0 0 1 .35.36l1.06 4.03a1 1 0 0 0 1.9.1zM13 3 9.15 13 8.1 8.98A1.5 1.5 0 0 0 7.02 7.9L3 6.85z" />
  </svg>
);

/** Fluent `location_arrow_16_filled`. */
export const FluentRefNavigationFilledIcon = () => (
  <svg {...base}>
    <path d="M12.64 2.07a1 1 0 0 1 1.29 1.3l-3.85 9.99a1 1 0 0 1-1.9-.1L7.12 9.23a.5.5 0 0 0-.35-.36L2.74 7.82a1 1 0 0 1-.1-1.9z" />
  </svg>
);

/** Fluent `cursor_click_20_regular`. */
export const FluentRefMousePointerClickIcon = () => (
  <svg {...base}>
    <path d="M7.5 2c.28 0 .5.22.5.5v2a.5.5 0 0 1-1 0v-2c0-.28.22-.5.5-.5M3.61 3.61c.2-.2.51-.2.7 0l1.42 1.42a.5.5 0 1 1-.7.7L3.6 4.32a.5.5 0 0 1 0-.7m7.78 0c.2.2.2.51 0 .7L9.97 5.74a.5.5 0 1 1-.7-.7l1.41-1.42c.2-.2.51-.2.7 0M2 7.5c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m6.64-.2A1 1 0 0 0 7 8.07v9.1a1 1 0 0 0 1.75.66l2.03-2.32c.28-.32.7-.51 1.13-.51h3.2a1 1 0 0 0 .65-1.77zM8 17.17v-9.1L15.12 14H11.9c-.72 0-1.4.31-1.88.85z" />
  </svg>
);

/** Fluent `cursor_click_20_filled`. */
export const FluentRefMousePointerClickFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 2c.28 0 .5.22.5.5v2a.5.5 0 0 1-1 0v-2c0-.28.22-.5.5-.5M3.61 3.61c.2-.2.51-.2.7 0l1.42 1.42a.5.5 0 1 1-.7.7L3.6 4.32a.5.5 0 0 1 0-.7m7.78 0c.2.2.2.51 0 .7L9.97 5.74a.5.5 0 1 1-.7-.7l1.41-1.42c.2-.2.51-.2.7 0M2 7.5c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m5.5.53v9.26c0 .45.54.67.85.36l2.56-2.56a2 2 0 0 1 1.42-.59h3.23a.5.5 0 0 0 .31-.9L8.31 7.65a.5.5 0 0 0-.81.4" />
  </svg>
);

/** Fluent `arrow_import_16_regular`. */
export const FluentRefImportIcon = () => (
  <svg {...base}>
    <path d="M13 12.5v-9a.5.5 0 0 1 1-.09v9.09a.5.5 0 0 1-1 .09zM1 8.09V8a.5.5 0 0 1 .41-.5h8.89L7.6 4.82a.5.5 0 0 1-.06-.64l.06-.07a.5.5 0 0 1 .64-.06l.07.06 3.53 3.54a.5.5 0 0 1 .06.63l-.06.07-3.53 3.54a.5.5 0 0 1-.77-.64l.06-.07L10.3 8.5H1.5a.5.5 0 0 1-.5-.41V8z" />
  </svg>
);

/** Fluent `arrow_import_16_filled`. */
export const FluentRefImportFilledIcon = () => (
  <svg {...base}>
    <path d="M7.22 4.22c.3-.3.77-.3 1.06 0l3.5 3.5c.3.3.3.77 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06-1.06L9.44 9H1.75a.75.75 0 0 1 0-1.5h7.69L7.22 5.28a.75.75 0 0 1 0-1.06m7.28-.47a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0z" />
  </svg>
);

/** Fluent `signature_16_regular`. */
export const FluentRefSignatureIcon = () => (
  <svg {...base}>
    <path d="M9.02 1.77a2.44 2.44 0 0 1 3.46 3.46l-.27.27.08.09a2 2 0 0 1 0 2.82l-1.44 1.44a.5.5 0 0 1-.7-.7l1.44-1.44a1 1 0 0 0 0-1.42l-.09-.08-5.65 5.64a1 1 0 0 1-.23.14l-4 1a.5.5 0 0 1-.6-.65L2.29 8.6a1 1 0 0 1 .12-.2zm2.75.7a1.44 1.44 0 0 0-2.04 0L3.19 9.03l-.93 2.77 2.98-.74 6.53-6.53c.57-.56.57-1.48 0-2.04M4.97 15c-1.24 0-2.21-.57-2.86-1.1l1.29-.33c.44.25.97.43 1.57.43q.6 0 1.27-.46.66-.45 1.31-1.1l.11-.1c.39-.36.79-.74 1.17-1 .4-.27.95-.53 1.52-.3q.54.22.79.73.23.47.38 1.1.08.31.23.5.06.09.11.12l.04.01q.18.01.63-.29.27-.18.5-.37l.3-.24a5 5 0 0 1 .98-.56l.02-.01h.01l.16.47-.16-.47a.5.5 0 0 1 .32.94l-.03.02-.15.06q-.2.1-.55.35l-.22.17q-.28.24-.62.47c-.3.21-.74.46-1.19.46a1.2 1.2 0 0 1-.95-.52c-.2-.25-.33-.57-.4-.85a4 4 0 0 0-.3-.9q-.13-.23-.26-.26c-.08-.03-.25-.04-.6.2q-.46.33-1.06.91l-.1.1c-.43.4-.92.85-1.45 1.2S5.64 15 4.97 15" />
  </svg>
);

/** Fluent `signature_16_filled`. */
export const FluentRefSignatureFilledIcon = () => (
  <svg {...base}>
    <path d="M12.48 1.77a2.44 2.44 0 0 0-3.46 0L2.4 8.4a1 1 0 0 0-.12.2l-1.25 3.74a.5.5 0 0 0 .6.65l4-1a1 1 0 0 0 .22-.14l5.65-5.64.09.08a1 1 0 0 1 0 1.42l-1.44 1.44a.5.5 0 0 0 .7.7l1.44-1.44a2 2 0 0 0 0-2.82l-.08-.09.27-.27c.95-.96.95-2.5 0-3.46M4.97 15c-1.24 0-2.21-.57-2.86-1.1l1.29-.33c.44.25.97.43 1.57.43q.6 0 1.27-.46.66-.45 1.31-1.1l.11-.1c.39-.36.79-.74 1.17-1 .4-.27.95-.53 1.52-.3q.54.22.79.73.23.47.38 1.1.08.31.23.5.06.09.11.12l.04.01q.18.01.63-.29.27-.18.5-.37l.3-.24a5 5 0 0 1 .98-.56l.02-.01h.01l.16.47-.16-.47a.5.5 0 0 1 .32.94l-.03.02-.15.06q-.2.1-.55.35l-.22.17q-.28.24-.62.47c-.3.21-.74.46-1.19.46a1.2 1.2 0 0 1-.95-.52c-.2-.25-.33-.57-.4-.85a4 4 0 0 0-.3-.9q-.13-.23-.26-.26c-.08-.03-.25-.04-.6.2q-.46.33-1.06.91l-.1.1c-.43.4-.92.85-1.45 1.2S5.64 15 4.97 15" />
  </svg>
);

/** Fluent `text_color_16_regular`. */
export const FluentRefTextColorIcon = () => (
  <svg {...base}>
    <path d="M8.46 1.3a.5.5 0 0 0-.92 0l-3 7a.5.5 0 1 0 .92.4L6.19 7H9.8l.73 1.7a.5.5 0 1 0 .92-.4zM9.38 6H6.62L8 2.77zM3.5 10c-.83 0-1.5.67-1.5 1.5v2c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zM3 11.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `text_color_16_filled`. */
export const FluentRefTextColorFilledIcon = () => (
  <svg {...base}>
    <path d="M12.5 10c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-2c0-.83.67-1.5 1.5-1.5zM8 .5c.3 0 .57.18.69.45l3 7a.75.75 0 0 1-1.38.6L9.65 7h-3.3L5.7 8.55a.75.75 0 0 1-1.38-.6l3-7 .05-.1A.8.8 0 0 1 8 .5m-1 5h2L8 3.15z" />
  </svg>
);

/** Fluent `group_20_regular`. */
export const FluentRefGroupIcon = () => (
  <svg {...base}>
    <path d="M7 4.5q0 .26-.05.5H10a1 1 0 0 1 1 1v2h-1a2 2 0 0 0-2 2v1H6a1 1 0 0 1-1-1V6.95a3 3 0 0 1-1 0V10c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h3.05a3 3 0 0 1 0-1H10a1 1 0 0 1-1-1v-2h1a2 2 0 0 0 2-2V9h2a1 1 0 0 1 1 1v3.05a3 3 0 0 1 1 0V10a2 2 0 0 0-2-2h-2V6a2 2 0 0 0-2-2H6.95q.05.24.05.5M11 9v1a1 1 0 0 1-1 1H9v-1a1 1 0 0 1 1-1zM6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m11 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-11 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
  </svg>
);

/** Fluent `group_20_filled`. */
export const FluentRefGroupFilledIcon = () => (
  <svg {...base}>
    <path d="M7 4.5q0 .55-.2 1H10c.28 0 .5.22.5.5v2H10a2 2 0 0 0-2 2v.5H6a.5.5 0 0 1-.5-.5V6.8a2.5 2.5 0 0 1-1.5.15V10c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h3.05a2.5 2.5 0 0 1 .16-1.5H10a.5.5 0 0 1-.5-.5v-2h.5a2 2 0 0 0 2-2v-.5h2c.28 0 .5.22.5.5v3.2a2.5 2.5 0 0 1 1.5-.15V10a2 2 0 0 0-2-2h-2V6a2 2 0 0 0-2-2H6.95q.05.24.05.5m3.5 5v.5a.5.5 0 0 1-.5.5h-.5V10c0-.28.22-.5.5-.5zM6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m11 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-11 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
  </svg>
);

/** Fluent `text_clear_formatting_16_regular`. */
export const FluentRefRemoveFormattingIcon = () => (
  <svg {...base}>
    <path d="M4.5 1c.2 0 .38.12.46.3l2.88 6.73-.75.76-.05-.1L6.31 7H2.7l-.73 1.7a.5.5 0 0 1-.92-.4l3-7A.5.5 0 0 1 4.5 1m1.38 5L4.5 2.77 3.12 6zm8.43.2V6c0-1.82-.95-3-2.42-3a2 2 0 0 0-1.82 1.02H10V1.5a.5.5 0 1 0-1 0v5.38l1-1v-.4c.15-1.03.76-1.65 1.67-1.65.86 0 1.43.53 1.62 1.44q.25.15.48.38zM9.51 15a1.5 1.5 0 0 1-1.57-.35l-1.59-1.59a1.5 1.5 0 0 1 0-2.12l4.59-4.59a1.5 1.5 0 0 1 2.12 0l1.59 1.59a1.5 1.5 0 0 1 0 2.12l-3.29 3.29-.01.01-.64.64h1.79a.5.5 0 0 1 0 1zm.78-2L8 10.7l-.94.95a.5.5 0 0 0 0 .7l1.59 1.59c.2.2.5.2.7 0zm.71-.7 2.94-2.95a.5.5 0 0 0 0-.7l-1.59-1.59a.5.5 0 0 0-.7 0L8.7 10z" />
  </svg>
);

/** Fluent `text_clear_formatting_16_filled`. */
export const FluentRefRemoveFormattingFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 1c.2 0 .38.12.46.3l2.88 6.73-.75.76-.05-.1L6.31 7H2.7l-.73 1.7a.5.5 0 0 1-.92-.4l3-7A.5.5 0 0 1 4.5 1m1.38 5L4.5 2.77 3.12 6zm8.43.2V6c0-1.82-.95-3-2.42-3a2 2 0 0 0-1.82 1.02H10V1.5a.5.5 0 1 0-1 0v5.38l1-1v-.4c.15-1.03.76-1.65 1.67-1.65.86 0 1.43.53 1.62 1.44q.25.15.48.38zm-1.25.15a1.5 1.5 0 0 0-2.12 0l-4.59 4.59a1.5 1.5 0 0 0 0 2.12l1.59 1.59A1.5 1.5 0 0 0 9.5 15h3a.5.5 0 0 0 0-1h-1.8l3.95-3.94a1.5 1.5 0 0 0 0-2.12zM8 10.71 10.3 13l-.95.94a.5.5 0 0 1-.7 0l-1.59-1.59a.5.5 0 0 1 0-.7z" />
  </svg>
);

/** Fluent `clipboard_checkmark_16_regular`. */
export const FluentRefClipboardCheckIcon = () => (
  <svg {...base}>
    <path d="M5.09 2c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h.59c.83 0 1.5.67 1.5 1.5v2.7q-.49-.13-1-.18V3.5a.5.5 0 0 0-.5-.5h-.59c-.2.58-.76 1-1.41 1h-3a1.5 1.5 0 0 1-1.41-1H4.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h2.1q.27.54.66 1H4.5A1.5 1.5 0 0 1 3 13.5v-10C3 2.67 3.67 2 4.5 2zM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm9.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `clipboard_checkmark_16_filled`. */
export const FluentRefClipboardCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M5.09 2c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h.59c.83 0 1.5.67 1.5 1.5v2.7A5.5 5.5 0 0 0 7.26 15H4.5A1.5 1.5 0 0 1 3 13.5v-10C3 2.67 3.67 2 4.5 2zM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm9.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `clipboard_paste_16_regular`. */
export const FluentRefClipboardPasteIcon = () => (
  <svg {...base}>
    <path d="M4.09 2H3.5A1.5 1.5 0 0 0 2 3.5v10A1.5 1.5 0 0 0 3.5 15h2.61v-1H3.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h.59c.2.58.76 1 1.41 1h3c.65 0 1.2-.42 1.41-1h.59a.5.5 0 0 1 .5.5V5h1V3.5A1.5 1.5 0 0 0 10.5 2h-.59c-.2-.58-.76-1-1.41-1h-3c-.65 0-1.2.42-1.41 1m.91.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M8.5 6C7.67 6 7 6.67 7 7.5v6c0 .83.67 1.5 1.5 1.5h4c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zM8 7.5c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5v6a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `clipboard_paste_16_filled`. */
export const FluentRefClipboardPasteFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2h.59c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h.59A1.5 1.5 0 0 1 12 3.5V5h-1V3.5a.5.5 0 0 0-.5-.5h-.59c-.2.58-.76 1-1.41 1h-3a1.5 1.5 0 0 1-1.41-1H3.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.61v1H3.5A1.5 1.5 0 0 1 2 13.5v-10A1.5 1.5 0 0 1 3.5 2m2 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm3 4C7.67 6 7 6.67 7 7.5v6c0 .83.67 1.5 1.5 1.5h4c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `text_bullet_list_add_20_regular`. */
export const FluentRefListPlusIcon = () => (
  <svg {...base}>
    <path d="M3 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3-1c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4.02 5.5q.05-.51.19-1H6.5a.5.5 0 0 0 0 1zM4 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m17 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V15h-1.5a.5.5 0 0 0 0 1H15v1.5a.5.5 0 0 0 1 0V16h1.5a.5.5 0 0 0 0-1H16z" />
  </svg>
);

/** Fluent `text_bullet_list_add_20_filled`. */
export const FluentRefListPlusFilledIcon = () => (
  <svg {...base}>
    <path d="M3.25 6a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M7 4.75c0-.41.34-.75.75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 4.75M7.75 9a.75.75 0 0 0 0 1.5h5.46a5.5 5.5 0 0 1 4.39-.09.75.75 0 0 0-.35-1.41zm0 5h2.46q-.21.72-.21 1.5H7.75a.75.75 0 0 1 0-1.5M4.5 9.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M3.25 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M20 15.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V15h-1.5a.5.5 0 0 0 0 1H15v1.5a.5.5 0 0 0 1 0V16h1.5a.5.5 0 0 0 0-1H16z" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_regular`. */
export const FluentRefListTreeIcon = () => (
  <svg {...base}>
    <path d="M2 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m4.5 4a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_filled`. */
export const FluentRefListTreeFilledIcon = () => (
  <svg {...base}>
    <path d="M2.25 5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m0 4.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.75 3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M5.75 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8m4.25 3.5a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `flowchart_16_regular`. */
export const FluentRefWorkflowIcon = () => (
  <svg {...base}>
    <path d="M2 3.5C2 2.67 2.67 2 3.5 2h2C6.33 2 7 2.67 7 3.5v2C7 6.33 6.33 7 5.5 7H5v1.88l.2.16 1.76 1.75.16.21H9v-.5c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 9 12.5V12H7.12l-.16.2-1.75 1.76a1 1 0 0 1-1.42 0L2.04 12.2a1 1 0 0 1 0-1.42L3.8 9.04 4 8.88V7h-.5A1.5 1.5 0 0 1 2 5.5zM3.5 3a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm7 7a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm-7.75 1.5 1.75 1.75 1.75-1.75L4.5 9.75z" />
  </svg>
);

/** Fluent `flowchart_16_filled`. */
export const FluentRefWorkflowFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v2C2 6.33 2.67 7 3.5 7H4v1.88l-.2.16-1.76 1.75a1 1 0 0 0 0 1.42l1.75 1.75a1 1 0 0 0 1.42 0l1.75-1.75.16-.21H9v.5c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5h-2C9.67 9 9 9.67 9 10.5v.5H7.12l-.16-.2L5.2 9.03 5 8.88V7h.5C6.33 7 7 6.33 7 5.5v-2C7 2.67 6.33 2 5.5 2z" />
  </svg>
);

/** Fluent `cloud_checkmark_16_regular`. */
export const FluentRefCloudCheckIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.77q.05.51.19 1h-.96a3.25 3.25 0 0 1-.22-6.5 4 4 0 0 1 7.89-.32q-.52-.14-1.09-.17A3 3 0 0 0 8 3m7 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `cloud_checkmark_16_filled`. */
export const FluentRefCloudCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.89-.32A5.5 5.5 0 0 0 5.2 12h-.96a3.25 3.25 0 0 1-.22-6.5m10.97 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 11.29l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `archive_arrow_back_16_regular`. */
export const FluentRefArchiveRestoreIcon = () => (
  <svg {...base}>
    <path d="M1 3.5C1 2.67 1.67 2 2.5 2h11c.83 0 1.5.67 1.5 1.5v1c0 .65-.42 1.2-1 1.41v.69q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5V5.91c-.58-.2-1-.76-1-1.41zM2.5 3a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm9 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m-.9-6.4-.9.9h1.55A2.75 2.75 0 0 1 14 13.25v.25a.5.5 0 0 1-1 0v-.25c0-.97-.78-1.75-1.75-1.75H9.71l.9.9a.5.5 0 0 1-.71.7l-1.76-1.75a.5.5 0 0 1 0-.7L9.9 8.9a.5.5 0 0 1 .7.7" />
  </svg>
);

/** Fluent `archive_arrow_back_16_filled`. */
export const FluentRefArchiveRestoreFilledIcon = () => (
  <svg {...base}>
    <path d="M2 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 4h9.5a5.5 5.5 0 0 0-4.9 8H4.5A2.5 2.5 0 0 1 2 11.5zm9.5 10a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m-.9-6.4-.9.9h1.55A2.75 2.75 0 0 1 14 13.25v.25a.5.5 0 0 1-1 0v-.25c0-.97-.78-1.75-1.75-1.75H9.71l.9.9a.5.5 0 0 1-.71.7l-1.76-1.75a.5.5 0 0 1 0-.7L9.9 8.9a.5.5 0 0 1 .7.7" />
  </svg>
);

/** Fluent `headset_16_regular`. */
export const FluentRefHeadsetIcon = () => (
  <svg {...base}>
    <path d="M4 6a4 4 0 1 1 8 0h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V6A5 5 0 0 0 3 6v5a3 3 0 0 0 3 3h.59a1.5 1.5 0 1 0 0-1H6a2 2 0 0 1-2-2h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm8 1v2a1 1 0 0 1-1 1h-1V7zm-6 3H4V7h2zm1.5 3.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0" />
  </svg>
);

/** Fluent `headset_16_filled`. */
export const FluentRefHeadsetFilledIcon = () => (
  <svg {...base}>
    <path d="M3 6.03A5 5 0 0 1 8 1c2.76 0 5 2.25 5 5.03v3.59c0 .79-.64 1.43-1.43 1.43h-1.43a.7.7 0 0 1-.71-.72V7.46c0-.4.32-.72.71-.72h1.79v-.71A3.94 3.94 0 0 0 8 2.08a3.94 3.94 0 0 0-3.93 3.95v.71h1.79c.4 0 .71.33.71.72v2.87c0 .4-.32.72-.71.72H4.43q-.18 0-.36-.04v.22c0 .86.66 1.56 1.5 1.61h.91a1.6 1.6 0 0 1 3.13.54 1.61 1.61 0 0 1-3.13.54h-.8A2.7 2.7 0 0 1 3 11.37V6.03" />
  </svg>
);

/** Fluent `person_settings_16_regular`. */
export const FluentRefPersonSettingsIcon = () => (
  <svg {...base}>
    <path d="M6.22 13.96C3.55 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8h2.1q-.24.48-.4 1H3.5a.5.5 0 0 0-.5.5v.5c0 1.13.88 2.33 2.5 2.8q.3.63.72 1.16m3.4-8.9a2.75 2.75 0 1 0-3.3 1.86q.48-.56 1.08-.97a1.76 1.76 0 0 1-2.15-1.7 1.75 1.75 0 1 1 3 1.23q.65-.3 1.38-.41M6.64 9.93a2 2 0 0 0 1.44-2.48L7.9 6.9q.38-.3.82-.5l.34.36a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52l-.13.42a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.43 2.48l.15.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01zm4.87.58a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
  </svg>
);

/** Fluent `person_settings_16_filled`. */
export const FluentRefPersonSettingsFilledIcon = () => (
  <svg {...base}>
    <path d="M9.63 5.07a5.5 5.5 0 0 0-3.3 1.85 2.75 2.75 0 1 1 3.3-1.85M5.6 8a5.5 5.5 0 0 0 .62 5.96C3.55 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8zm1.03 1.92a2 2 0 0 0 1.44-2.48L7.9 6.9q.38-.3.82-.5l.34.36a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52l-.13.42a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.43 2.48l.15.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01zm4.87.58a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
  </svg>
);

/** Fluent `alert_on_16_regular`. */
export const FluentRefBellRingIcon = () => (
  <svg {...base}>
    <path d="M.58 2.22a.5.5 0 0 1 .7-.14l1.5 1a.5.5 0 0 1-.56.84l-1.5-1a.5.5 0 0 1-.14-.7M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h3a2 2 0 1 0 4 0h3a.5.5 0 0 0 .46-.69l-.96-2.4V6.5A4.5 4.5 0 0 0 8 2m1 10a1 1 0 0 1-1 1 1 1 0 0 1-1-1zM4.5 6.5a3.5 3.5 0 0 1 7 0V9q0 .09.04.18l.72 1.82H3.74l.72-1.82L4.5 9zm10.22-4.42a.5.5 0 0 1 .56.84l-1.5 1a.5.5 0 0 1-.56-.84zM0 6.5c0-.28.22-.5.5-.5H2a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5M15.5 6a.5.5 0 0 1 0 1H14a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `alert_on_16_filled`. */
export const FluentRefBellRingFilledIcon = () => (
  <svg {...base}>
    <path d="M.58 2.22a.5.5 0 0 1 .7-.14l1.5 1a.5.5 0 0 1-.56.84l-1.5-1a.5.5 0 0 1-.14-.7M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h10a.5.5 0 0 0 .46-.69l-.96-2.4V6.5A4.5 4.5 0 0 0 8 2m0 12.5A2 2 0 0 1 6.06 13h3.88A2 2 0 0 1 8 14.5m6.72-12.42a.5.5 0 0 1 .56.84l-1.5 1a.5.5 0 0 1-.56-.84zM0 6.5c0-.28.22-.5.5-.5H2a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5M15.5 6a.5.5 0 0 1 0 1H14a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `dismiss_square_20_regular`. */
export const FluentRefSquareXIcon = () => (
  <svg {...base}>
    <path d="M7.15 7.15c.2-.2.5-.2.7 0L10 9.29l2.15-2.14a.5.5 0 0 1 .7.7L10.71 10l2.14 2.15a.5.5 0 0 1-.7.7L10 10.71l-2.15 2.14a.5.5 0 0 1-.7-.7L9.29 10 7.15 7.85a.5.5 0 0 1 0-.7M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
  </svg>
);

/** Fluent `dismiss_square_20_filled`. */
export const FluentRefSquareXFilledIcon = () => (
  <svg {...base}>
    <path d="M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm4.15 1.15a.5.5 0 0 0 0 .7L9.29 10l-2.14 2.15a.5.5 0 0 0 .7.7L10 10.71l2.15 2.14a.5.5 0 0 0 .7-.7L10.71 10l2.14-2.15a.5.5 0 0 0-.7-.7L10 9.29 7.85 7.15a.5.5 0 0 0-.7 0" />
  </svg>
);

/** Fluent `more_circle_16_regular`. */
export const FluentRefMoreCircleIcon = () => (
  <svg {...base}>
    <path d="M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8m5-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2m0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `more_circle_16_filled`. */
export const FluentRefMoreCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m0-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
  </svg>
);

/** Fluent `radio_button_16_regular`. */
export const FluentRefRadioButtonIcon = () => (
  <svg {...base}>
    <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8" />
  </svg>
);

/** Fluent `radio_button_16_filled`. */
export const FluentRefRadioButtonFilledIcon = () => (
  <svg {...base}>
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0-9a6 6 0 1 0 0 12A6 6 0 0 0 8 2M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8" />
  </svg>
);

/** Fluent `star_half_16_regular`. */
export const FluentRefStarHalfIcon = () => (
  <svg {...base}>
    <path d="M5.67 5.18 7.2 2.1c.17-.33.49-.5.81-.5s.64.17.8.5l1.53 3.08 3.4.5a.9.9 0 0 1 .5 1.53l-2.46 2.4.58 3.39a.9.9 0 0 1-1.3.95L8 12.35l-3.04 1.6a.9.9 0 0 1-1.3-.95l.57-3.39-2.46-2.4a.9.9 0 0 1 .5-1.53zM8 11.34a1 1 0 0 1 .42.1l2.9 1.53-.55-3.24a.9.9 0 0 1 .26-.8l2.36-2.3-3.26-.46a.9.9 0 0 1-.67-.5L8 2.73z" />
  </svg>
);

/** Fluent `star_half_16_filled`. */
export const FluentRefStarHalfFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1.6a.9.9 0 0 0-.8.5L5.66 5.18l-3.4.5a.9.9 0 0 0-.5 1.53l2.46 2.4L3.65 13a.9.9 0 0 0 1.3.95L8 12.35z" />
  </svg>
);

/** Fluent `shield_error_16_regular`. */
export const FluentRefShieldAlertIcon = () => (
  <svg {...base}>
    <path d="M8.35 2.15a.5.5 0 0 0-.7 0A5.7 5.7 0 0 1 3.5 4a.5.5 0 0 0-.5.5v3q.02 4.85 4.84 6.47.16.06.32 0C11.36 12.91 13 10.72 13 7.5v-3a.5.5 0 0 0-.5-.5q-2.28 0-4.15-1.85M4 4.98a6.7 6.7 0 0 0 4-1.8 6.6 6.6 0 0 0 4 1.8V7.5q-.02 2.14-1.02 3.45A6 6 0 0 1 8 12.97a6 6 0 0 1-2.98-2.02A5.6 5.6 0 0 1 4 7.5zm4.5.52a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0zm.25 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" />
  </svg>
);

/** Fluent `shield_error_16_filled`. */
export const FluentRefShieldAlertFilledIcon = () => (
  <svg {...base}>
    <path d="M8.35 2.15a.5.5 0 0 0-.7 0A5.7 5.7 0 0 1 3.5 4a.5.5 0 0 0-.5.5v3q.02 4.85 4.84 6.47.16.06.32 0C11.36 12.91 13 10.72 13 7.5v-3a.5.5 0 0 0-.5-.5q-2.28 0-4.15-1.85M8.5 5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 1 0m-.5 6A.75.75 0 1 1 8 10a.75.75 0 0 1 0 1.5" />
  </svg>
);

/** Fluent `image_add_20_regular`. */
export const FluentRefImagePlusIcon = () => (
  <svg {...base}>
    <path d="M10 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zm8 .5h-3.2q-.15-.52-.4-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6q.48.25 1 .4V14q0 .56.28 1.02l4.67-4.59a1.5 1.5 0 0 1 2.1 0l4.67 4.59Q16 14.56 16 14V6a2 2 0 0 0-2-2m0 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0m-8.01 8.23A2 2 0 0 0 6 16h8a2 2 0 0 0 1.01-.27l-4.66-4.58a.5.5 0 0 0-.7 0z" />
  </svg>
);

/** Fluent `image_add_20_filled`. */
export const FluentRefImagePlusFilledIcon = () => (
  <svg {...base}>
    <path d="M10 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zM5.5 11a5.5 5.5 0 0 0 4.9-8H14a3 3 0 0 1 3 3v8q-.01.99-.56 1.74l-5.39-5.3a1.5 1.5 0 0 0-2.1 0l-5.4 5.3C3.22 15.25 3 14.64 3 14v-3.6q1.14.59 2.5.6m7-3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-8.23 7.45q.75.54 1.73.55h8q.98-.01 1.73-.55l-5.38-5.3a.5.5 0 0 0-.7 0z" />
  </svg>
);

/** Fluent `cart_16_regular`. */
export const FluentRefCartAddIcon = () => (
  <svg {...base}>
    <path d="M2.5 2a.5.5 0 0 0 0 1h.25a.5.5 0 0 1 .48.36L4.8 8.91A1.5 1.5 0 0 0 6.25 10h4.57a1.5 1.5 0 0 0 1.4-.94l1.47-3.69A1 1 0 0 0 12.76 4H4.45l-.26-.91A1.5 1.5 0 0 0 2.75 2zm3.27 6.64L4.73 5h8.03L11.3 8.69a.5.5 0 0 1-.47.31H6.25a.5.5 0 0 1-.48-.36M6.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m4 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1" />
  </svg>
);

/** Fluent `cart_16_filled`. */
export const FluentRefCartAddFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 2a.5.5 0 0 0 0 1h.25a.5.5 0 0 1 .48.36L4.8 8.91A1.5 1.5 0 0 0 6.25 10h4.57a1.5 1.5 0 0 0 1.4-.94l1.47-3.69A1 1 0 0 0 12.76 4H4.45l-.26-.91A1.5 1.5 0 0 0 2.75 2zm4 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

/** Fluent `calendar_clock_16_regular`. */
export const FluentRefCalendarClockIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m4.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M11.5 9a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5H13a.5.5 0 0 0 0-1h-1V9.5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `calendar_clock_16_filled`. */
export const FluentRefCalendarClockFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm2 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M11.5 9a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5H13a.5.5 0 0 0 0-1h-1V9.5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `toggle_right_16_regular`. */
export const FluentRefToggleIcon = () => (
  <svg {...base}>
    <path d="M11 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4M1 8a4 4 0 0 1 4-4h6a4 4 0 0 1 0 8H5a4 4 0 0 1-4-4m4-3a3 3 0 0 0 0 6h6a3 3 0 1 0 0-6z" />
  </svg>
);

/** Fluent `toggle_right_16_filled`. */
export const FluentRefToggleFilledIcon = () => (
  <svg {...base}>
    <path d="M5 4a4 4 0 1 0 0 8h6a4 4 0 0 0 0-8zm6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
  </svg>
);

/** Fluent `accessibility_16_regular`. */
export const FluentRefAccessibilityIcon = () => (
  <svg {...base}>
    <path d="M6.75 3.25a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0M8 1a2.25 2.25 0 0 0-2.19 2.77L4.2 3.12a1.6 1.6 0 0 0-2.08.87c-.33.81.06 1.74.87 2.07l2.01.8v2.4l-1.81 3.4a1.6 1.6 0 1 0 2.8 1.5L8 10.39l2 3.77a1.6 1.6 0 0 0 2.81-1.5L11 9.26v-2.4l2-.8c.82-.33 1.21-1.26.88-2.07a1.6 1.6 0 0 0-2.08-.87l-1.61.65A2.26 2.26 0 0 0 8 1M3.05 4.37a.6.6 0 0 1 .77-.33l3.43 1.39a2 2 0 0 0 1.5 0l3.43-1.39a.6.6 0 0 1 .77.33c.13.3-.02.64-.32.76l-2 .81a1 1 0 0 0-.63.93v2.38a1 1 0 0 0 .12.47l1.81 3.41a.6.6 0 0 1-1.04.56l-2-3.77a1 1 0 0 0-1.77 0l-2 3.77a.6.6 0 1 1-1.05-.56l1.81-3.4A1 1 0 0 0 6 9.24V6.87a1 1 0 0 0-.63-.93l-2-.8a.6.6 0 0 1-.32-.77" />
  </svg>
);

/** Fluent `accessibility_16_filled`. */
export const FluentRefAccessibilityFilledIcon = () => (
  <svg {...base}>
    <path d="M8 4.5A1.75 1.75 0 1 0 8 1a1.75 1.75 0 0 0 0 3.5M4.2 3.12a1.6 1.6 0 0 0-2.08.87c-.33.81.06 1.74.87 2.07l1.7.68a.5.5 0 0 1 .31.47v1.92a1 1 0 0 1-.06.23l-1.75 3.3a1.6 1.6 0 1 0 2.8 1.5l1.79-3.35c.1-.18.35-.18.44 0L10 14.16a1.6 1.6 0 1 0 2.81-1.5l-1.75-3.3a1 1 0 0 1-.06-.23V7.2c0-.2.12-.4.31-.47l1.7-.68c.81-.33 1.2-1.26.87-2.07a1.6 1.6 0 0 0-2.08-.87l-.78.31c-.26.1-.44.3-.54.52a2.75 2.75 0 0 1-4.96 0c-.1-.22-.28-.42-.54-.52z" />
  </svg>
);

/** Fluent `tag_percent_16_regular`. */
export const FluentRefDiscountIcon = () => (
  <svg {...base}>
    <path d="M10 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2M1.59 9.14a2 2 0 0 1 0-2.83L6.33 1.6c.37-.37.88-.58 1.4-.59L11 1A2 2 0 0 1 13 3l-.02 2.59q-.48-.25-1-.39L12 3a1 1 0 0 0-1-1L7.73 2a1 1 0 0 0-.7.3L2.3 7.01a1 1 0 0 0 0 1.41l2.74 2.73q.11.9.48 1.68a2 2 0 0 1-.64-.42zM15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M7.5 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0m5.35-.85a.5.5 0 0 0-.7 0l-4 4a.5.5 0 0 0 .7.7l4-4a.5.5 0 0 0 0-.7M12.5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `tag_percent_16_filled`. */
export const FluentRefDiscountFilledIcon = () => (
  <svg {...base}>
    <path d="M1.59 6.31a2 2 0 0 0 0 2.83l3.3 3.28a2 2 0 0 0 .63.42 5.5 5.5 0 0 1 7.46-7.25L13 3.01A2 2 0 0 0 10.99 1l-3.25.01c-.53 0-1.04.22-1.41.59zM10 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M7.5 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0m5.35-.85a.5.5 0 0 0-.7 0l-4 4a.5.5 0 0 0 .7.7l4-4a.5.5 0 0 0 0-.7M12.5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `currency_dollar_euro_16_regular`. */
export const FluentRefCurrencyEuroIcon = () => (
  <svg {...base}>
    <path d="M4.5 2a.5.5 0 0 0-.5.5v.33a2.7 2.7 0 0 0-2 2.6v.1c0 1.1.65 2.1 1.65 2.55l.35.16v3.87a1.7 1.7 0 0 1-1-1.55v-.72a.5.5 0 0 0-1 0v.72c0 1.25.85 2.3 2 2.61v.34a.5.5 0 0 0 1 0v-.26a2.7 2.7 0 0 0 2.4-2.69v-.09c0-1.1-.64-2.1-1.65-2.54L5 7.59V3.76c.8.14 1.4.84 1.4 1.67v.74a.5.5 0 0 0 1 0v-.74A2.7 2.7 0 0 0 5 2.75V2.5a.5.5 0 0 0-.5-.5M3 5.43c0-.68.41-1.28 1-1.55v3.26c-.61-.3-1-.93-1-1.61zm2 6.8V8.69l.34.16c.65.29 1.06.93 1.06 1.63v.09c0 .84-.6 1.53-1.4 1.68M9.07 9A7 7 0 0 1 9 8h-.5a.5.5 0 0 1 0-1h.57c.13-.94.45-1.8.91-2.47C10.6 3.63 11.5 3 12.56 3c.4 0 .85.12 1.22.36a.5.5 0 0 1-.56.83 1.2 1.2 0 0 0-.66-.19c-.63 0-1.26.38-1.75 1.1q-.53.78-.73 1.91h.42a.5.5 0 0 1 0 1H10q0 .52.08 1h.42a.5.5 0 1 1 0 1h-.15q.18.5.46.9c.5.72 1.12 1.1 1.75 1.1q.4 0 .65-.18a.5.5 0 0 1 .58.82c-.38.26-.84.36-1.23.36-1.06 0-1.96-.63-2.58-1.54A6 6 0 0 1 9.3 10h-.8a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `currency_dollar_euro_16_filled`. */
export const FluentRefCurrencyEuroFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 2a.75.75 0 0 0-.75.75v.35c-1.15.33-2 1.4-2 2.65v.04c0 1.1.65 2.1 1.67 2.55L4 8.5v2.75c-.3-.23-.5-.6-.5-1v-.6a.75.75 0 0 0-1.5 0v.6c0 1.26.85 2.32 2 2.65v.36a.75.75 0 1 0 1.5 0v-.36a2.78 2.78 0 0 0 .34-5.23L5.5 7.5V4.75c.3.23.5.6.5 1v.62a.75.75 0 1 0 1.5 0v-.62c0-1.26-.84-2.32-2-2.65v-.35A.75.75 0 0 0 4.75 2M3.5 5.75c0-.4.2-.77.5-1v2.06c-.31-.24-.5-.62-.5-1.02zm2 5.48V9.2c.31.24.5.62.5 1.03s-.2.78-.5 1.01m5-3.23h.75a.75.75 0 0 0 0-1.5h-.55q.17-.64.47-1.1c.4-.65.87-.9 1.26-.9q.22.01.38.11a.75.75 0 1 0 .88-1.2c-.38-.28-.84-.4-1.26-.4-1.09 0-1.96.69-2.53 1.59q-.52.82-.75 1.9h-.4a.75.75 0 1 0 0 1.5H9q0 .5.07 1h-.32a.75.75 0 1 0 0 1.5h.7q.19.49.45.9c.57.9 1.44 1.6 2.53 1.6.4 0 .88-.1 1.28-.41a.75.75 0 1 0-.92-1.19q-.11.1-.36.1c-.39 0-.86-.25-1.26-.9l-.06-.1h.14a.75.75 0 1 0 0-1.5h-.67a6 6 0 0 1-.08-1" />
  </svg>
);

/** Fluent `door_arrow_right_16_regular`. */
export const FluentRefExitDoorIcon = () => (
  <svg {...base}>
    <path d="M4.75 1C3.78 1 3 1.78 3 2.75v10.5c0 .97.78 1.75 1.75 1.75h2.5a6 6 0 0 1-.65-1H4.75a.75.75 0 0 1-.75-.75V2.75c0-.41.34-.75.75-.75h6.5c.41 0 .75.34.75.75v3.27q.51.05 1 .19V2.75C13 1.78 12.22 1 11.25 1zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4.5 8a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m.35-2.15a.5.5 0 0 1-.7-.7L12.29 12H9.5a.5.5 0 0 1 0-1h2.8l-1.15-1.15a.5.5 0 0 1 .7-.7l2 2a.5.5 0 0 1 .15.35.5.5 0 0 1-.14.35z" />
  </svg>
);

/** Fluent `door_arrow_right_16_filled`. */
export const FluentRefExitDoorFilledIcon = () => (
  <svg {...base}>
    <path d="M3 2.75C3 1.78 3.78 1 4.75 1h6.5c.97 0 1.75.78 1.75 1.75v3.46A5.5 5.5 0 0 0 7.26 15H4.75C3.78 15 3 14.22 3 13.25zM6 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5.5 7a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m.35-2.15a.5.5 0 0 1-.7-.7L12.29 12H9.5a.5.5 0 0 1 0-1h2.8l-1.15-1.15a.5.5 0 0 1 .7-.7l2 2a.5.5 0 0 1 .15.35.5.5 0 0 1-.14.35z" />
  </svg>
);

/** Fluent `location_target_square_16_regular`. */
export const FluentRefLocateIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0m-.96-.5H4.5a.5.5 0 0 0 0 1h.54a3 3 0 0 0 2.46 2.46v.54a.5.5 0 0 0 1 0v-.54a3 3 0 0 0 2.46-2.46h.54a.5.5 0 0 0 0-1h-.54A3 3 0 0 0 8.5 5.04V4.5a.5.5 0 0 0-1 0v.54A3 3 0 0 0 5.04 7.5M9 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `location_target_square_16_filled`. */
export const FluentRefLocateFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0m-.96-.5A3 3 0 0 1 7.5 5.04V4.5a.5.5 0 0 1 1 0v.54a3 3 0 0 1 2.46 2.46h.54a.5.5 0 0 1 0 1h-.54a3 3 0 0 1-2.46 2.46v.54a.5.5 0 0 1-1 0v-.54A3 3 0 0 1 5.04 8.5H4.5a.5.5 0 0 1 0-1zM9 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
  </svg>
);

/** Fluent `lasso_20_regular`. */
export const FluentRefLassoIcon = () => (
  <svg {...base}>
    <path d="M8.16 2.21a8 8 0 0 1 3.68 0 .5.5 0 0 1-.23.98 7 7 0 0 0-3.22 0 .5.5 0 0 1-.23-.98M6.48 3.36a.5.5 0 0 1-.16.68 7 7 0 0 0-2.28 2.28.5.5 0 1 1-.85-.53 8 8 0 0 1 2.6-2.6.5.5 0 0 1 .7.17m7.04 0a.5.5 0 0 1 .69-.17 8 8 0 0 1 2.6 2.6.5.5 0 0 1-.85.53 7 7 0 0 0-2.28-2.28.5.5 0 0 1-.16-.68M2.82 7.79a.5.5 0 0 1 .37.6 7 7 0 0 0 0 3.22.5.5 0 0 1-.98.23 8 8 0 0 1 0-3.68.5.5 0 0 1 .6-.37m14.37 0a.5.5 0 0 1 .6.37 8 8 0 0 1 0 3.68.5.5 0 0 1-.98-.23 7 7 0 0 0 0-3.22.5.5 0 0 1 .38-.6M3.36 13.52a.5.5 0 0 1 .68.16q.88 1.4 2.28 2.28a.5.5 0 1 1-.53.85 8 8 0 0 1-2.6-2.6.5.5 0 0 1 .17-.7m13.57.73a.5.5 0 1 0-.86-.5l-.02.03a4 4 0 0 1-.32.46 8 8 0 0 1-1.16 1.22A6.6 6.6 0 0 0 10.5 14c-1.52 0-2.49.9-2.49 2s.97 2 2.49 2a7 7 0 0 0 4.03-1.26 9 9 0 0 1 1.5 1.95l.02.03a.5.5 0 1 0 .9-.44s-.13-.24 0 0l-.01-.02-.1-.18-.3-.48a10 10 0 0 0-1.19-1.45l-.02-.03a9 9 0 0 0 1.6-1.86zM10.5 15c1.3 0 2.38.46 3.23 1.07-.85.53-1.93.93-3.23.93-1.13 0-1.49-.6-1.49-1s.36-1 1.49-1" />
  </svg>
);

/** Fluent `lasso_20_filled`. */
export const FluentRefLassoFilledIcon = () => (
  <svg {...base}>
    <path d="M8.16 2.21a8 8 0 0 1 3.68 0 .75.75 0 0 1-.35 1.46 6.5 6.5 0 0 0-2.98 0 .75.75 0 0 1-.35-1.46M6.83 3.44c.21.35.1.81-.25 1.03a6.5 6.5 0 0 0-2.11 2.11.75.75 0 0 1-1.28-.79 8 8 0 0 1 2.6-2.6.75.75 0 0 1 1.04.25m6.34 0a.75.75 0 0 1 1.04-.25 8 8 0 0 1 2.6 2.6.75.75 0 0 1-1.28.8 6.5 6.5 0 0 0-2.11-2.12.75.75 0 0 1-.25-1.03M3.11 7.6c.4.1.66.5.56.9a6.5 6.5 0 0 0 0 3 .75.75 0 0 1-1.46.34 8 8 0 0 1 0-3.68c.1-.4.5-.65.9-.56m13.78 0c.4-.1.8.16.9.56a8 8 0 0 1 0 3.68.75.75 0 0 1-1.46-.35 6.5 6.5 0 0 0 0-2.98c-.1-.4.15-.81.56-.9M3.44 13.17a.75.75 0 0 1 1.03.25 6.5 6.5 0 0 0 2.11 2.11.75.75 0 1 1-.79 1.28 8 8 0 0 1-2.6-2.6.75.75 0 0 1 .25-1.04m13.67 1.27a.75.75 0 0 0-1.22-.88l-.02.03-.38.46q-.37.44-1.02 1.01a6.7 6.7 0 0 0-3.97-1.31 2.6 2.6 0 0 0-1.84.68 2.17 2.17 0 0 0 0 3.14 2.6 2.6 0 0 0 1.84.68c1.53 0 2.87-.58 3.91-1.27a9 9 0 0 1 1.1 1.31l.3.52.02.02c-.15-.26 0 0 0 0a.75.75 0 0 0 1.34-.67c.19.38 0 0 0 0l-.01-.02-.02-.04a6 6 0 0 0-.4-.64 10 10 0 0 0-1.13-1.4 12 12 0 0 0 1.46-1.57l.03-.04zm-6.61.81c1.03 0 1.91.3 2.65.74a5.4 5.4 0 0 1-2.65.76c-.42 0-.67-.13-.8-.26a.67.67 0 0 1 0-.98c.13-.13.38-.26.8-.26" />
  </svg>
);

/** Fluent `text_paragraph_16_regular`. */
export const FluentRefPilcrowIcon = () => (
  <svg {...base}>
    <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm9 11a.5.5 0 0 0 .5-.5V6h1v7.5a.5.5 0 0 0 1 0V6h.5a.5.5 0 0 0 0-1H11a3 3 0 1 0 0 6v2.5c0 .28.22.5.5.5M10 6.27A2 2 0 0 1 11 6v4a2 2 0 0 1-2-2 2 2 0 0 1 1-1.73M7.54 6H2.5a.5.5 0 0 0 0 1h4.63q.14-.53.4-1m-.41 3q.14.53.4 1H2.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `text_paragraph_16_filled`. */
export const FluentRefPilcrowFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3.5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m10 10a.5.5 0 0 1-1 0V11a3 3 0 1 1 0-6h3.5a.5.5 0 0 1 0 1H14v7.5a.5.5 0 0 1-1 0V6h-1zM2.5 6h5.04q-.27.47-.41 1H2.5a.5.5 0 0 1 0-1m5.04 4a4 4 0 0 1-.41-1H2.5a.5.5 0 0 0 0 1z" />
  </svg>
);

/** Fluent `table_insert_row_16_regular`. */
export const FluentRefInsertRowIcon = () => (
  <svg {...base}>
    <path d="M2.5 13a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm0-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zM2 9.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-9C2.67 5 2 5.67 2 6.5zm1.5.5a.5.5 0 0 1-.5-.5v-3c0-.28.22-.5.5-.5H5v4zM6 10V6h4v4zm5 0V6h1.5c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5z" />
  </svg>
);

/** Fluent `table_insert_row_16_filled`. */
export const FluentRefInsertRowFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 13a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm0-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zM2 9.5c0 .83.67 1.5 1.5 1.5H5V5H3.5C2.67 5 2 5.67 2 6.5zm8 1.5H6V5h4zm1 0V5h1.5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5z" />
  </svg>
);

/** Fluent `text_proofing_tools_20_regular`. */
export const FluentRefSpellCheckIcon = () => (
  <svg {...base}>
    <path d="M4.94 3c.21 0 .4.14.47.33l1.77 5a.5.5 0 0 1-.94.34l-.26-.73V8H3.73l-.26.68a.5.5 0 1 1-.94-.36l1.94-5A.5.5 0 0 1 4.94 3m-.02 1.94L4.12 7h1.53zm12.49-.41c-.25-.69-.6-1.1-1.06-1.33-.4-.2-.83-.2-1.1-.2h-.03c-.55 0-1 .19-1.33.49-.32.29-.52.65-.64.99A4 4 0 0 0 13 5.77v.05c0 .39 0 1.09.25 1.73.13.33.33.67.66.93q.48.41 1.25.5c.42.05 1.67.02 2.23-1.24a.5.5 0 1 0-.9-.4c-.3.64-.94.68-1.22.65a1.3 1.3 0 0 1-.73-.28 1.3 1.3 0 0 1-.36-.52A4 4 0 0 1 14 5.8V5.8l.02-.28q.04-.31.16-.68.14-.37.38-.6a1 1 0 0 1 .66-.23c.3 0 .5 0 .7.1.15.08.36.25.55.77a.5.5 0 1 0 .94-.34m-5.94 1.3q.31-.4.32-1.07 0-.57-.22-.96a1.4 1.4 0 0 0-.56-.57c-.4-.23-.84-.23-1-.23H8.5a.5.5 0 0 0-.5.5v5c0 .28.22.5.5.5h1.75c.22 0 .66-.03 1.07-.27.45-.26.8-.74.8-1.49q0-.57-.25-.98a2 2 0 0 0-.4-.42m-.95-1.73q.1.06.18.18a1 1 0 0 1 .1.48c0 .4-.16.54-.28.62-.17.1-.38.12-.5.12H9V4h1q.26-.02.52.1M9.36 6.5h.83c.18 0 .43 0 .62.1q.14.07.2.18.1.12.1.46c0 .38-.14.54-.3.62-.18.11-.42.14-.56.14H9V6.5zm4.4 4.32a.5.5 0 1 0-.78-.64l-3.74 4.58-1.89-1.89a.5.5 0 0 0-.7.71l2.27 2.27a.5.5 0 0 0 .74-.03z" />
  </svg>
);

/** Fluent `text_proofing_tools_20_filled`. */
export const FluentRefSpellCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M16.97 2.98q.78.38 1.17 1.46a.75.75 0 1 1-1.4.51c-.18-.47-.35-.59-.44-.63-.12-.06-.27-.07-.58-.07a.7.7 0 0 0-.5.17q-.18.15-.3.5a3 3 0 0 0-.17.88c0 .41 0 .9.16 1.3q.11.27.3.42.16.17.6.23c.08 0 .28 0 .48-.07a.8.8 0 0 0 .46-.45.75.75 0 0 1 1.37.61c-.63 1.42-2.03 1.45-2.48 1.4a2.6 2.6 0 0 1-1.4-.56c-.35-.3-.58-.68-.72-1.04a5 5 0 0 1-.27-1.8v-.08l.03-.4c.03-.26.1-.61.23-.97.14-.36.35-.77.72-1.09q.56-.53 1.49-.55h.03c.28 0 .75 0 1.22.23m-11.58.27A.75.75 0 0 0 4 3.23l-1.94 5a.75.75 0 1 0 1.4.54l.1-.27h2.11l.1.25a.75.75 0 0 0 1.4-.5zM5.13 7h-1l.53-1.34zM8 3.5v5a.75.75 0 0 0 .87.74v.01h1.63c.24 0 .73-.04 1.2-.3.52-.3.92-.87.92-1.7q0-.64-.28-1.12a2 2 0 0 0-.29-.35q.23-.41.24-1.02t-.25-1.08a1.7 1.7 0 0 0-.66-.67c-.46-.26-.95-.26-1.12-.26H8.75A.75.75 0 0 0 8 3.5m2.5 4.25h-1v-1h.94q.3-.01.51.08.07.03.1.08.06.04.07.33-.01.25-.06.3a.3.3 0 0 1-.12.1 1 1 0 0 1-.44.11m-.88-2.5H9.5v-1h.75q.25-.01.4.07l.08.08q.05.05.06.36 0 .26-.06.3a.3.3 0 0 1-.1.1 1 1 0 0 1-.35.09zm4.32 5.73a.75.75 0 0 0-1.16-.95l-3.56 4.35-1.69-1.68a.75.75 0 0 0-1.06 1.06l2.27 2.27a.75.75 0 0 0 1.11-.06z" />
  </svg>
);

/** Fluent `text_wrap_16_regular`. */
export const FluentRefTextWrapIcon = () => (
  <svg {...base}>
    <path d="M2 3.5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h10a2.5 2.5 0 0 1 0 5H9.7l.65.65a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 0 1 .7.7l-.64.65h2.79a1.5 1.5 0 0 0 0-3h-10a.5.5 0 0 1-.5-.5M6 11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `text_wrap_16_filled`. */
export const FluentRefTextWrapFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h9.5a1.25 1.25 0 1 1 0 2.5h-1.69l.22-.22a.75.75 0 1 0-1.06-1.06l-1.5 1.5c-.3.3-.3.77 0 1.06l1.5 1.5a.75.75 0 1 0 1.06-1.06l-.22-.22h1.69a2.75 2.75 0 1 0 0-5.5zM2 11.75c0-.41.34-.75.75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75" />
  </svg>
);

/** Fluent `document_search_16_regular`. */
export const FluentRefFileSearchIcon = () => (
  <svg {...base}>
    <path d="M5 1a2 2 0 0 0-2 2v2.26q.48-.18 1-.23V3a1 1 0 0 1 1-1h3v2.5C8 5.33 8.67 6 9.5 6H12v7a1 1 0 0 1-1 1h-.09q.18.5 0 1H11a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06L9.65 1.44A1.5 1.5 0 0 0 8.59 1zm6.8 4H9.5a.5.5 0 0 1-.5-.5V2.2zm-5.2 7.3a3.5 3.5 0 1 1 .7-.7l2.55 2.55a.5.5 0 0 1-.7.7zM7 9.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0" />
  </svg>
);

/** Fluent `document_search_16_filled`. */
export const FluentRefFileSearchFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1v3.5C8 5.33 8.67 6 9.5 6H13v7.5c0 .83-.67 1.5-1.5 1.5h-.59a1.5 1.5 0 0 0-.35-1.56l-2-2Q9 10.54 9 9.5a4.5 4.5 0 0 0-6-4.24V2.5C3 1.67 3.67 1 4.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zM6.6 12.3a3.5 3.5 0 1 1 .7-.7l2.55 2.55a.5.5 0 0 1-.7.7zM7 9.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0" />
  </svg>
);

/** Fluent `document_table_16_regular`. */
export const FluentRefFileSpreadsheetIcon = () => (
  <svg {...base}>
    <path d="M5 9.25v2.5c0 .69.56 1.25 1.25 1.25h3.5c.69 0 1.25-.56 1.25-1.25v-2.5C11 8.56 10.44 8 9.75 8h-3.5C5.56 8 5 8.56 5 9.25m1 0c0-.14.11-.25.25-.25H7v1H6zm4 .75H8V9h1.75q.23.02.25.25zm-2 1h2v.75q-.02.23-.25.25H8zm-1 0v1h-.75a.25.25 0 0 1-.25-.25V11zM3 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6H9.5A1.5 1.5 0 0 1 8 4.5V2zm4.5 3h2.3L9 2.2v2.3c0 .28.22.5.5.5" />
  </svg>
);

/** Fluent `document_table_16_filled`. */
export const FluentRefFileSpreadsheetFilledIcon = () => (
  <svg {...base}>
    <path d="M6 9.25c0-.14.11-.25.25-.25H7v1H6zM6 11h1v1h-.75a.25.25 0 0 1-.25-.25zm4 .75V11H8v1h1.75q.23-.02.25-.25M8 9v1h2v-.75A.25.25 0 0 0 9.75 9zm0-4.5V1H4.5C3.67 1 3 1.67 3 2.5v11c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V6H9.5A1.5 1.5 0 0 1 8 4.5M5 9.25C5 8.56 5.56 8 6.25 8h3.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25h-3.5C5.56 13 5 12.44 5 11.75zM9 4.5V1.25L12.75 5H9.5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `rss_16_regular`. */
export const FluentRefRssIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm1 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M9 10.5A3.5 3.5 0 0 0 5.5 7a.5.5 0 0 0 0 1A2.5 2.5 0 0 1 8 10.5a.5.5 0 0 0 1 0m3 0A6.5 6.5 0 0 0 5.5 4a.5.5 0 0 0 0 1 5.5 5.5 0 0 1 5.5 5.5.5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `rss_16_filled`. */
export const FluentRefRssFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 2h-7A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2m-6 9.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m3-.25a.5.5 0 0 1-.5-.5A2.5 2.5 0 0 0 5.5 8a.5.5 0 0 1 0-1A3.5 3.5 0 0 1 9 10.5a.5.5 0 0 1-.5.5m3 0a.5.5 0 0 1-.5-.5A5.5 5.5 0 0 0 5.5 5a.5.5 0 0 1 0-1 6.5 6.5 0 0 1 6.5 6.5.5.5 0 0 1-.5.5" />
  </svg>
);

/** Fluent `document_edit_16_regular`. */
export const FluentRefFilePenIcon = () => (
  <svg {...base}>
    <path d="M5 1a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h1.05l.25-1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3v2.5C8 5.33 8.67 6 9.5 6H12v1.44q.46-.3 1-.4V5.4c0-.4-.16-.78-.44-1.06L9.65 1.44A1.5 1.5 0 0 0 8.58 1zm6.8 4H9.5a.5.5 0 0 1-.5-.5V2.2zM13 8.06q-.37.1-.66.4l-4.3 4.28q-.52.53-.71 1.26l-.01.03-.3 1.21a.6.6 0 0 0 .73.74l1.22-.3q.73-.2 1.29-.73l4.28-4.29A1.56 1.56 0 0 0 13 8.06" />
  </svg>
);

/** Fluent `document_edit_16_filled`. */
export const FluentRefFilePenFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1v3.5C8 5.33 8.67 6 9.5 6H13v1.04q-.77.13-1.37.7l-4.29 4.3q-.73.73-1 1.75l-.3 1.2H4.5A1.5 1.5 0 0 1 3 13.5V2.5C3 1.67 3.67 1 4.5 1zm5 7.06q-.37.1-.66.4l-4.3 4.28q-.53.54-.72 1.3l-.3 1.2a.6.6 0 0 0 .73.74l1.22-.3q.73-.2 1.29-.73l4.28-4.29A1.56 1.56 0 0 0 13 8.06M9 1.25V4.5c0 .28.22.5.5.5h3.25z" />
  </svg>
);

/** Fluent `gantt_chart_16_regular`. */
export const FluentRefChartGanttIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 10.5zM3.5 4C2.67 4 2 4.67 2 5.5v5c0 .83.67 1.5 1.5 1.5H5V7h1v5h4v-1.09q.23.09.5.09h.5v1h1.5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5H11v2h-1V4zm0 1a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM7 7.5c0-.28.22-.5.5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M10.5 9a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `gantt_chart_16_filled`. */
export const FluentRefChartGanttFilledIcon = () => (
  <svg {...base}>
    <path d="M10 3H6v1h.5a1.5 1.5 0 0 1 1.41 2H10zm1 10v-2h1.5a1.5 1.5 0 0 0 .4-2.95A1.5 1.5 0 0 0 11.5 6H11V3h1.5A2.5 2.5 0 0 1 15 5.5v5a2.5 2.5 0 0 1-2.5 2.5zM9 9.5q0-.27.09-.5H7.5A1.5 1.5 0 0 1 6 7.5V13h4v-2.09c-.58-.2-1-.76-1-1.41M5 7H3.5a1.5 1.5 0 1 1 0-3H5V3H3.5A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13H5zM3.5 5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm4 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm3 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `voicemail_16_regular`. */
export const FluentRefVoicemailIcon = () => (
  <svg {...base}>
    <path d="M7.33 7q.17.35.17.75A1.75 1.75 0 1 1 5.75 6h4.5a1.75 1.75 0 1 1-1.58 1zM5 7.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0M10.25 7a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M3.5 3C2.67 3 2 3.67 2 4.5V11c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V4.5c0-.83-.67-1.5-1.5-1.5zM3 4.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5V11a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 11z" />
  </svg>
);

/** Fluent `voicemail_16_filled`. */
export const FluentRefVoicemailFilledIcon = () => (
  <svg {...base}>
    <path d="M5 7.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0m4.5 0a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0M3.5 3C2.67 3 2 3.67 2 4.5V11c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V4.5c0-.83-.67-1.5-1.5-1.5zm4 4.75A1.75 1.75 0 1 1 5.75 6h4.5a1.75 1.75 0 1 1-1.58 1H7.33q.17.35.17.75" />
  </svg>
);

/** Fluent `call_missed_16_regular`. */
export const FluentRefPhoneMissedIcon = () => (
  <svg {...base}>
    <path d="m9.2 4.15.22.97a2 2 0 0 0 1.63 1.54l.7.12a1.9 1.9 0 0 0 2.16-1.46c.32-1.36-.18-2.9-1.6-3.5a11.51 11.51 0 0 0-8.59 0c-1.43.6-1.94 2.14-1.62 3.51a1.9 1.9 0 0 0 2.16 1.45l.7-.12A2 2 0 0 0 6.6 5.12l.21-.97A6 6 0 0 1 8 4a5 5 0 0 1 1.2.15m2.73-1.4c.85.35 1.25 1.32 1.01 2.35a.9.9 0 0 1-1.03.69l-.7-.12a1 1 0 0 1-.81-.77l-.28-1.26a.5.5 0 0 0-.33-.36l-.16.47.16-.47h-.02l-.03-.02-.5-.12a6 6 0 0 0-2.97.12l-.03.01h-.01a.5.5 0 0 0-.34.37L5.61 4.9a1 1 0 0 1-.81.77l-.7.12a.9.9 0 0 1-1.03-.69c-.24-1.02.17-2 1.02-2.34a10.5 10.5 0 0 1 7.84 0M8 9.5a.5.5 0 0 0-1 0v2c0 .28.23.5.5.5H9a.5.5 0 0 0 0-1H8zM4 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0m4-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
  </svg>
);

/** Fluent `call_missed_16_filled`. */
export const FluentRefPhoneMissedFilledIcon = () => (
  <svg {...base}>
    <path d="m9.45 3.92.3 1.51c.13.6.6 1.07 1.2 1.18l.68.13a2 2 0 0 0 2.3-1.52l.08-.3c.26-1.13-.15-2.39-1.3-2.91a11.47 11.47 0 0 0-9.4 0c-1.15.52-1.57 1.79-1.3 2.91l.06.3a2 2 0 0 0 2.3 1.52l.68-.13a1.5 1.5 0 0 0 1.2-1.18l.3-1.51a10 10 0 0 1 1.46-.17 7 7 0 0 1 1.44.17M7.5 9c.28 0 .5.22.5.5V11h1a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5v-2c0-.28.23-.5.5-.5M8 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-3 4a3 3 0 1 1 6 0 3 3 0 0 1-6 0" />
  </svg>
);

/** Fluent `live_16_regular`. */
export const FluentRefBroadcastIcon = () => (
  <svg {...base}>
    <path d="M3.05 3.05a.5.5 0 0 1 .7.7 6 6 0 0 0 0 8.5.5.5 0 0 1-.7.7 7 7 0 0 1 0-9.9m9.2 0c.19-.2.5-.2.7 0a7 7 0 0 1 0 9.9.5.5 0 0 1-.7-.7 6 6 0 0 0 0-8.5.5.5 0 0 1 0-.7M4.81 4.82a.5.5 0 1 1 .7.7 3.5 3.5 0 0 0 0 4.95.5.5 0 0 1-.7.71 4.5 4.5 0 0 1 0-6.36m5.66 0c.19-.2.5-.2.7 0a4.5 4.5 0 0 1 0 6.36.5.5 0 0 1-.7-.7 3.5 3.5 0 0 0 0-4.95.5.5 0 0 1 0-.71M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
  </svg>
);

/** Fluent `live_16_filled`. */
export const FluentRefBroadcastFilledIcon = () => (
  <svg {...base}>
    <path d="M3.05 3.05A.75.75 0 0 1 4.1 4.11a5.5 5.5 0 0 0 0 7.78.75.75 0 0 1-1.06 1.06 7 7 0 0 1 0-9.9m8.84 0c.3-.3.77-.3 1.06 0a7 7 0 0 1 0 9.9.75.75 0 1 1-1.06-1.06 5.5 5.5 0 0 0 0-7.78.75.75 0 0 1 0-1.06M5.17 5.17a.75.75 0 1 1 1.06 1.06 2.5 2.5 0 0 0 0 3.54.75.75 0 0 1-1.06 1.06 4 4 0 0 1 0-5.66m4.6 0c.3-.3.77-.3 1.06 0a4 4 0 0 1 0 5.66.75.75 0 1 1-1.06-1.06 2.5 2.5 0 0 0 0-3.54.75.75 0 0 1 0-1.06M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
  </svg>
);

/** Fluent `cast_20_regular`. */
export const FluentRefCastIcon = () => (
  <svg {...base}>
    <path d="M2 5.5C2 4.67 2.67 4 3.5 4h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5zM3.5 5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm2 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M4 10.5c0-.28.22-.5.5-.5A3.5 3.5 0 0 1 8 13.5a.5.5 0 1 1-1 0A2.5 2.5 0 0 0 4.5 11a.5.5 0 0 1-.5-.5M4 8c0-.28.22-.5.5-.5a6 6 0 0 1 6 6 .5.5 0 0 1-1 0 5 5 0 0 0-5-5A.5.5 0 0 1 4 8" />
  </svg>
);

/** Fluent `cast_20_filled`. */
export const FluentRefCastFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 4C2.67 4 2 4.67 2 5.5v9c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5zM4 8c0-.28.22-.5.5-.5a6 6 0 0 1 6 6 .5.5 0 0 1-1 0 5 5 0 0 0-5-5A.5.5 0 0 1 4 8m.5 2A3.5 3.5 0 0 1 8 13.5a.5.5 0 1 1-1 0A2.5 2.5 0 0 0 4.5 11a.5.5 0 0 1 0-1m.25 4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5" />
  </svg>
);

/** Fluent `image_off_20_regular`. */
export const FluentRefImageOffIcon = () => (
  <svg {...base}>
    <path d="M2.85 2.15a.5.5 0 1 0-.7.7l1.4 1.41A3 3 0 0 0 3 6v8a3 3 0 0 0 3 3h8q.99-.01 1.74-.55l1.4 1.4a.5.5 0 0 0 .71-.7zm6.56 7.97a2 2 0 0 0-.46.31l-4.67 4.59A2 2 0 0 1 4 14V6a2 2 0 0 1 .28-1.02zM6 16a2 2 0 0 1-1.01-.27l4.66-4.58c.2-.2.5-.2.7 0l4.66 4.58A2 2 0 0 1 14 16zM16 6v7.88l.9.9A3 3 0 0 0 17 14V6a3 3 0 0 0-3-3H6a3 3 0 0 0-.78.1l.9.9H14a2 2 0 0 1 2 2m-2 1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m-1 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
  </svg>
);

/** Fluent `image_off_20_filled`. */
export const FluentRefImageOffFilledIcon = () => (
  <svg {...base}>
    <path d="M2.85 2.15a.5.5 0 1 0-.7.7l1.4 1.41A3 3 0 0 0 3 6v8q.01.99.55 1.74l5.39-5.39q.18-.18.41-.29l.98.98a.5.5 0 0 0-.68.02l-5.39 5.39q.77.53 1.74.55h8q.99-.01 1.74-.55l1.4 1.4a.5.5 0 0 0 .71-.7zM17 14a3 3 0 0 1-.1.78L5.22 3.1A3 3 0 0 1 6 3h8a3 3 0 0 1 3 3zm-2.5-7.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0" />
  </svg>
);

/** Fluent `battery_charge_20_regular`. */
export const FluentRefBatteryChargingIcon = () => (
  <svg {...base}>
    <path d="M6.32 6H3a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h13a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.33l.1-.18q.2-.42.1-.82H16a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1 3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3.83zm3.05-3.82c.16-.3.63-.2.63.15V5h1.64c.2 0 .32.2.23.37L9.62 9.82c-.15.3-.62.2-.62-.15V7H7.35a.26.26 0 0 1-.22-.37z" />
  </svg>
);

/** Fluent `battery_charge_20_filled`. */
export const FluentRefBatteryChargingFilledIcon = () => (
  <svg {...base}>
    <path d="M6.23 6.18C5.81 7 6.42 8 7.35 8H8v1.67c0 1.4 1.88 1.85 2.52.6l2.25-4.45q.2-.42.1-.82H16a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v.15A3 3 0 0 1 16 15H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3.83zm3.14-4c.16-.3.63-.2.63.15V5h1.64c.2 0 .32.2.23.37L9.62 9.82c-.15.3-.62.2-.62-.15V7H7.35a.26.26 0 0 1-.22-.37z" />
  </svg>
);

/** Fluent `battery_warning_20_regular`. */
export const FluentRefBatteryLowIcon = () => (
  <svg {...base}>
    <path d="M3.6 9.55a1 1 0 0 1 1.8 0l3.5 7A1 1 0 0 1 8 18H1a1 1 0 0 1-.9-1.45zM4.5 16a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M16 5a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1 3 3 0 0 1-3 3H9.24l-.5-1H16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v4q0 .23.05.44L.47 13.6A3 3 0 0 1 0 12V8a3 3 0 0 1 3-3zM4.5 11a.5.5 0 0 0-.5.5v3a.5.5 0 1 0 1 0v-3a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `battery_warning_20_filled`. */
export const FluentRefBatteryLowFilledIcon = () => (
  <svg {...base}>
    <path d="M3.6 9.55a1 1 0 0 1 1.8 0l3.5 7A1 1 0 0 1 8 18H1a1 1 0 0 1-.9-1.45zM4.5 16a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M16 5a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v.15A3 3 0 0 1 16 15H9.24L6.29 9.1a2 2 0 0 0-3.58 0L.47 13.6A3 3 0 0 1 0 12V8a3 3 0 0 1 3-3zM4.5 11a.5.5 0 0 0-.5.5v3a.5.5 0 1 0 1 0v-3a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `brightness_high_16_regular`. */
export const FluentRefBrightnessIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4m6.5-1.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM8 13c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5M2.5 8.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zm.65-5.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 9.7a.5.5 0 1 1-.7-.7l1-1a.5.5 0 1 1 .7.7zm9-9.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 9.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `brightness_high_16_filled`. */
export const FluentRefBrightnessFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0z" />
    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 6v4a2 2 0 1 0 0-4" />
    <path d="M15 8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1c.28 0 .5.22.5.5" />
    <path d="M8.5 13.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0z" />
    <path d="M3 8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1c.28 0 .5.22.5.5" />
    <path d="M3.85 3.15a.5.5 0 0 0-.7.7l1 1a.5.5 0 1 0 .7-.7z" />
    <path d="M3.15 12.85c.2.2.5.2.7 0l1-1a.5.5 0 1 0-.7-.7l-1 1a.5.5 0 0 0 0 .7" />
    <path d="M12.15 3.15a.5.5 0 0 1 .7.7l-1 1a.5.5 0 0 1-.7-.7z" />
    <path d="M12.85 12.85a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l1 1c.2.2.2.5 0 .7" />
  </svg>
);

/** Fluent `phone_desktop_16_regular`. */
export const FluentRefDevicesIcon = () => (
  <svg {...base}>
    <path d="M6 2h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8v1h2v1H8v1h3.5a.5.5 0 0 0 0-1H11v-1h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2h1V3a1 1 0 0 1 1-1M3.5 12a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm-1-6C1.67 6 1 6.67 1 7.5v6c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-6C7 6.67 6.33 6 5.5 6zm0 1h3c.28 0 .5.22.5.5v6a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-6c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `phone_desktop_16_filled`. */
export const FluentRefDevicesFilledIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2h1.5A2.5 2.5 0 0 1 8 7.5V11h2v1H8v1h3.5a.5.5 0 0 0 0-1H11v-1h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM2.5 6C1.67 6 1 6.67 1 7.5v6c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-6C7 6.67 6.33 6 5.5 6zm.5 6.5c0-.28.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `games_16_regular`. */
export const FluentRefGamepadIcon = () => (
  <svg {...base}>
    <path d="M3.5 7.5c0-.28.23-.5.5-.5h1V6a.5.5 0 0 1 1 0v1h1a.5.5 0 0 1 0 1H6v1a.5.5 0 1 1-1 0V8H4a.5.5 0 0 1-.5-.5M11 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2M1 7.5A4.5 4.5 0 0 1 5.5 3h5a4.5 4.5 0 1 1 0 9h-5A4.5 4.5 0 0 1 1 7.5M5.5 4a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 0 0-7z" />
  </svg>
);

/** Fluent `games_16_filled`. */
export const FluentRefGamepadFilledIcon = () => (
  <svg {...base}>
    <path d="M5.5 3a4.5 4.5 0 0 0 0 9h5.01a4.5 4.5 0 1 0 0-9zm-2 4.5c0-.28.23-.5.5-.5h1V6a.5.5 0 1 1 1 0v1h1a.5.5 0 0 1 0 1H6v1a.5.5 0 0 1-1 0V8H4a.5.5 0 0 1-.5-.5M11 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
  </svg>
);

/** Fluent `cellular_data_1_20_regular`. */
export const FluentRefSignalIcon = () => (
  <svg {...base}>
    <path d="M16.5 4a.5.5 0 0 1 .5.41V15.5a.5.5 0 0 1-.99.09V4.5c0-.28.22-.5.5-.5m-9 6a.5.5 0 0 1 .5.4v5.1a.5.5 0 0 1-.99.09v-5.1c0-.27.22-.5.5-.5m-3 2a.5.5 0 0 1 .5.4v3.1a.5.5 0 0 1-1 .09v-3.1c0-.27.22-.5.5-.5m6-4a.5.5 0 0 1 .5.4v7.1a.5.5 0 0 1-1 .09v-7.1c0-.27.22-.5.5-.5m3-2a.5.5 0 0 1 .5.41v9.09a.5.5 0 0 1-1 .09V6.5c0-.27.22-.5.5-.5" />
  </svg>
);

/** Fluent `cellular_data_1_20_filled`. */
export const FluentRefSignalFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 12c.38 0 .69.28.74.64l.01.11v2.5a.75.75 0 0 1-1.5.11v-2.61c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v4.5a.75.75 0 0 1-1.5.11v-4.61c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v6.5a.75.75 0 0 1-1.5.11V8.75c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v8.5a.75.75 0 0 1-1.5.11V6.75c0-.41.34-.75.75-.75m3-2c.37 0 .68.27.74.63l.01.1-.01 10.52a.74.74 0 0 1-1.48.12l-.01-.1.01-10.52c0-.41.33-.75.74-.75" />
  </svg>
);

/** Fluent `usb_stick_20_regular`. */
export const FluentRefUsbIcon = () => (
  <svg {...base}>
    <path d="M7.5 2h5c.28 0 .5.22.5.5V6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2V2.5c0-.28.22-.5.5-.5M12 6V3H8v3zM7 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `usb_stick_20_filled`. */
export const FluentRefUsbFilledIcon = () => (
  <svg {...base}>
    <path d="M7 2.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5V6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2zM8 6h4V3H8z" />
  </svg>
);

/** Fluent `shield_dismiss_16_regular`. */
export const FluentRefShieldOffIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4a.5.5 0 0 1 .5.41V7.5c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.74 12.94 3.1 10.85 3 7.8V4.5c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M8 3.19a6.7 6.7 0 0 1-3.71 1.76L4 4.98V7.5c0 2.64 1.22 4.4 3.74 5.37l.26.1.26-.1Q11.9 11.5 12 7.77V4.98a6.6 6.6 0 0 1-4-1.8M6.09 6.22l.06-.07a.5.5 0 0 1 .64-.06l.07.06L8 7.29l1.15-1.14a.5.5 0 0 1 .64-.06l.07.06c.17.17.19.44.05.63l-.06.07L8.71 8l1.14 1.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71 6.85 9.85a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L7.29 8 6.15 6.85a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

/** Fluent `shield_dismiss_16_filled`. */
export const FluentRefShieldOffFilledIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v3c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.64 12.91 3 10.72 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M6.53 5.84a.5.5 0 0 0-.63.06l-.06.07a.5.5 0 0 0 .06.63L7.3 8 5.9 9.4l-.06.07a.5.5 0 0 0 .06.63l.07.06c.2.14.46.12.63-.06L8 8.7l1.4 1.4.07.06c.2.14.46.12.63-.06l.06-.07a.5.5 0 0 0-.06-.63L8.7 8l1.4-1.4.06-.07a.5.5 0 0 0-.06-.63l-.07-.06a.5.5 0 0 0-.63.06L8 7.3 6.6 5.9z" />
  </svg>
);

/** Fluent `badge_20_regular`. */
export const FluentRefBadgeIcon = () => (
  <svg {...base}>
    <path d="M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4m1 9V6.83A3 3 0 0 1 16 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h8a3 3 0 0 1 .17-1H5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2" />
  </svg>
);

/** Fluent `badge_20_filled`. */
export const FluentRefBadgeFilledIcon = () => (
  <svg {...base}>
    <path d="M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 1a3 3 0 0 0 1-.17V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h8.17A3 3 0 0 0 16 7" />
  </svg>
);

/** Fluent `handshake_16_regular`. */
export const FluentRefHandshakeIcon = () => (
  <svg {...base}>
    <path d="M8.2 2a.5.5 0 0 0-.38.18l-.05.04a4.6 4.6 0 0 0-4.4 1.02 4 4 0 0 0-1.21 3.68l-.02.01-.67.64a1.35 1.35 0 0 0 0 1.98c.35.32.81.45 1.26.4q.1.35.39.63c.26.25.6.38.93.4q.04.51.43.9c.26.24.6.38.94.4q.04.5.43.89c.53.5 1.37.54 1.95.12l.33.31c.58.55 1.52.55 2.1 0q.39-.39.43-.88.53-.04.93-.4.39-.39.43-.9.53-.03.92-.4.3-.3.4-.66c.44.05.9-.08 1.23-.4.58-.55.58-1.44 0-1.98l-.6-.57.12-.41c.26-.98.13-2-.37-2.9A4.2 4.2 0 0 0 10.03 2H8.2m4.38 5.46.48.48.1.08.69.64c.17.17.17.44 0 .6a.47.47 0 0 1-.65 0L12.07 8.2a.53.53 0 0 0-.73 0l-.01.01c-.2.2-.2.5 0 .69l.89.84c.17.17.17.44 0 .6a.5.5 0 0 1-.6.05.54.54 0 0 0-.67.04.47.47 0 0 0-.04.64c.13.17.12.41-.04.56a.5.5 0 0 1-.6.04.54.54 0 0 0-.68.04.47.47 0 0 0-.05.64c.14.17.13.42-.04.57a.5.5 0 0 1-.65 0l-.32-.3.09-.08c.57-.55.57-1.43 0-1.98q-.42-.37-.94-.4a1.4 1.4 0 0 0-.43-.9q-.41-.36-.94-.4a1.4 1.4 0 0 0-.43-.89 1.5 1.5 0 0 0-1.26-.4q-.1-.34-.38-.63c-.3-.28-.7-.42-1.1-.4-.11-.93.2-1.9.96-2.6.7-.67 1.65-.98 2.58-.92l-1.1.79a1.5 1.5 0 0 0-.3 2.18c.55.66 1.53.8 2.23.3l1.35-.97h1.44zM6.17 4.61 8.39 3h1.64c1.2 0 2.27.62 2.82 1.6.35.61.46 1.33.3 2.02l-2.21-2.18a.5.5 0 0 0-.35-.14h-1.9a.5.5 0 0 0-.29.09L6.92 5.47a.64.64 0 0 1-.85-.12.5.5 0 0 1 .1-.74m1.08 6.63a.5.5 0 0 1 .64 0c.18.17.18.44 0 .6l-.67.64a.5.5 0 0 1-.64 0 .4.4 0 0 1 0-.6zm-.73-.7-.67.65a.5.5 0 0 1-.64 0 .4.4 0 0 1-.01-.6l.01-.01.67-.64h.01a.5.5 0 0 1 .63 0c.18.17.18.44 0 .6M5.15 9.27l-.67.63v.01a.5.5 0 0 1-.64 0 .4.4 0 0 1 0-.61l.67-.64a.5.5 0 0 1 .64 0c.18.17.18.43.02.6zM3.51 8.23l-.67.63a.5.5 0 0 1-.64 0 .4.4 0 0 1 0-.6l.67-.64a.5.5 0 0 1 .64 0c.18.17.18.44 0 .6" />
  </svg>
);

/** Fluent `handshake_16_filled`. */
export const FluentRefHandshakeFilledIcon = () => (
  <svg {...base}>
    <path d="M6.95 2.07A4.15 4.15 0 0 0 2.14 7.2a1.45 1.45 0 0 1 2.35.72 1.45 1.45 0 0 1 1.65 1.33 1.44 1.44 0 0 1 1.33 1.33 1.44 1.44 0 0 1 .92 2.46l-.23.23.69.66c.2.18.5.17.68-.01a.5.5 0 0 0 .05-.64l-.04-.04-.05-.05-.1-.1a.5.5 0 0 1 0-.71c.2-.2.51-.2.7 0l.14.14.09.09.07.07c.19.19.49.19.67 0a.5.5 0 0 0 0-.67l-.15-.15a.5.5 0 0 1-.14-.37.5.5 0 0 1 .85-.35l.11.11c.2.2.54.2.74 0 .21-.2.21-.54 0-.74l-.02-.03-.1-.08-.77-.78a.5.5 0 0 1 0-.71c.2-.2.51-.2.71 0l.73.73.05.04.06.06a.8.8 0 0 0 1.08-.05.8.8 0 0 0 0-1.15l-.74-.74-.03-.03-3-3.04h-.76l-1.71 1.3a1.89 1.89 0 0 1-2.28-3zm3.7 1.66a.5.5 0 0 1 .36.15l2.7 2.74a3.15 3.15 0 0 0-1.55-4.31 2 2 0 0 0-1.06-.28H8.65l-.05.05-2.3 1.75a.89.89 0 0 0 1.07 1.4l1.84-1.4a.5.5 0 0 1 .3-.1zM6.36 11l-.66.65a.45.45 0 0 1-.63 0 .44.44 0 0 1-.01-.61l.01-.01.66-.66v-.01a.45.45 0 0 1 .63.01c.17.17.17.46 0 .63m.05 1.99a.45.45 0 0 0 .63 0l.65-.66a.44.44 0 0 0-.06-.68.45.45 0 0 0-.56.05l-.66.66a.44.44 0 0 0 0 .63M3.4 8.59l-.65.66a.45.45 0 0 1-.63 0 .44.44 0 0 1-.01-.62v-.01l.66-.66.02-.01a.45.45 0 0 1 .61.01c.18.18.18.46 0 .63M4.9 9.7l-.66.66a.45.45 0 0 1-.63 0 .44.44 0 0 1 0-.62v-.01l.66-.65.01-.02a.45.45 0 0 1 .62.02c.17.17.17.45 0 .62" />
  </svg>
);

/** Fluent `emoji_meh_16_regular`. */
export const FluentRefMehIcon = () => (
  <svg {...base}>
    <path d="M7 7a.75.75 0 1 1-1.5 0A.75.75 0 0 1 7 7m2.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6 9a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2-7a6 6 0 1 1 0 12A6 6 0 0 1 8 2m0 1a5 5 0 1 0 0 10A5 5 0 0 0 8 3" />
  </svg>
);

/** Fluent `emoji_meh_16_filled`. */
export const FluentRefMehFilledIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8m5-1a.75.75 0 1 1-1.5 0A.75.75 0 0 1 7 7m3.5 0A.75.75 0 1 1 9 7a.75.75 0 0 1 1.5 0M6 9h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `savings_16_regular`. */
export const FluentRefPiggyBankIcon = () => (
  <svg {...base}>
    <path d="M13.97 7.72q.03.26.03.55c0 1.3-.45 2.17-.89 2.71a4 4 0 0 1-.84.76.5.5 0 0 0-.27.44v1.32a.5.5 0 0 1-.5.5H11a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1h-.5a.5.5 0 0 1-.5-.5v-.6a.5.5 0 0 0-.45-.5l-.1-.02-.36-.12c-.3-.13-.7-.34-1.07-.71a4 4 0 0 1-.86-1.45c-.14-.41-.47-.78-.94-.92A.3.3 0 0 1 2 8.9v-.8c0-.12.09-.24.21-.27.48-.14.8-.53.95-.95.1-.34.3-.77.63-1.1a5 5 0 0 1 1.35-.95l.02-.01a.5.5 0 0 0 .3-.46V2.68q.33.27.7.52.5.33 1.08.51.17-.5.46-.93a2.4 2.4 0 0 1-.99-.41 7 7 0 0 1-.94-.76.8.8 0 0 0-.82-.15.8.8 0 0 0-.48.7v1.88a6 6 0 0 0-1.4 1.03 4 4 0 0 0-.86 1.49q-.1.25-.27.3C1.38 7 1 7.52 1 8.1v.79c0 .58.39 1.1.95 1.26.1.03.22.12.27.28.17.47.5 1.22 1.1 1.82A4 4 0 0 0 5 13.3v.21c0 .83.67 1.5 1.5 1.5H7a1 1 0 0 0 1-1h2a1 1 0 0 0 1 1h.5c.83 0 1.5-.67 1.5-1.5v-1.04l.12-.1c.21-.16.5-.4.77-.75A5.2 5.2 0 0 0 15 8.27q0-.98-.27-1.75-.27.67-.76 1.2m-.18-3.85a3 3 0 0 1-.9 3.5c-.43.34-1 .31-1.49.1L9.01 6.5c-.49-.2-.9-.6-.97-1.12a3 3 0 0 1 5.75-1.5M12.26 6.6a2 2 0 1 0-3.23-1.33q-.01.02.07.11.09.1.3.2l2.39.98q.2.08.34.08.12-.01.13-.04m-6.51.91a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `savings_16_filled`. */
export const FluentRefPiggyBankFilledIcon = () => (
  <svg {...base}>
    <path d="M13.5 8.16a4 4 0 0 0 1.23-1.64q.27.78.27 1.75a5.2 5.2 0 0 1-1.88 4.1l-.12.09v1.04c0 .83-.67 1.5-1.5 1.5H11a1 1 0 0 1-1-1H8a1 1 0 0 1-1 1h-.5A1.5 1.5 0 0 1 5 13.5v-.21a4 4 0 0 1-1.69-1.04c-.6-.6-.92-1.35-1.09-1.82a.4.4 0 0 0-.27-.28A1.3 1.3 0 0 1 1 8.89v-.8c0-.57.38-1.08.94-1.23q.17-.05.27-.3c.13-.4.39-1.01.87-1.5a6 6 0 0 1 1.39-1.02V2.16c0-.35.23-.6.48-.7s.58-.08.82.15c.26.24.59.52.94.76q.56.36.99.41a4 4 0 0 0-.65 2.7c.12 1.04.91 1.66 1.58 1.93l2.39 1c.67.27 1.67.4 2.48-.25M4.75 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m3.48-3.58a3 3 0 0 1 5.56-.04 3 3 0 0 1-.9 3.5c-.43.33-1 .3-1.49.1l-2.39-1c-.49-.2-.9-.58-.97-1.1a3 3 0 0 1 0-.77zm0 0-.14.44z" />
  </svg>
);

/** Fluent `scales_16_regular`. */
export const FluentRefScaleIcon = () => (
  <svg {...base}>
    <path d="M13.5 2a.5.5 0 0 1 0 1h-.26l1.72 4.31.04.19a2.5 2.5 0 0 1-5 0l.04-.19L11.76 3H8.5v8h3a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3h3V3H4.24l1.72 4.31.04.19a2.5 2.5 0 0 1-5 0l.04-.19L2.76 3H2.5a.5.5 0 0 1 0-1zm-9 10a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zM2.09 8A1.5 1.5 0 0 0 4.9 8zm9 0a1.5 1.5 0 0 0 2.82 0zM2.24 7h2.52L3.5 3.84zm9 0h2.52L12.5 3.84z" />
  </svg>
);

/** Fluent `scales_16_filled`. */
export const FluentRefScaleFilledIcon = () => (
  <svg {...base}>
    <path d="M13.5 2a.5.5 0 0 1 0 1h-.26l1.72 4.31.04.19a2.5 2.5 0 0 1-5 0l.04-.19L11.76 3H8.5v8h3a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3h3V3H4.24l1.72 4.31.04.19a2.5 2.5 0 0 1-5 0l.04-.19L2.76 3H2.5a.5.5 0 0 1 0-1zM2.24 7h2.52L3.5 3.84zm9 0h2.52L12.5 3.84z" />
  </svg>
);

/** Fluent `weather_snow_20_regular`. */
export const FluentRefCloudSnowIcon = () => (
  <svg {...base}>
    <path d="M8.5 15a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M7 14a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M10 4c2.46 0 3.86 1.57 4.07 3.47h.06A2.8 2.8 0 0 1 17 10.24 2.8 2.8 0 0 1 14.13 13H5.87A2.8 2.8 0 0 1 3 10.24c0-1.47 1.2-2.67 2.7-2.76h.23C6.13 5.55 7.53 4 10 4m0 1a3.04 3.04 0 0 0-3.09 3.02c0 .28-.25.5-.54.5h-.55c-1 0-1.82.78-1.82 1.74S4.81 12 5.82 12h8.36c1 0 1.82-.78 1.82-1.74s-.81-1.74-1.82-1.74h-.55c-.29 0-.54-.22-.54-.5A3 3 0 0 0 10 5" />
  </svg>
);

/** Fluent `weather_snow_20_filled`. */
export const FluentRefCloudSnowFilledIcon = () => (
  <svg {...base}>
    <path d="M8.5 15a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M7 14a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m3 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M10 4c2.46 0 3.86 1.57 4.07 3.47h.06A2.8 2.8 0 0 1 17 10.24 2.8 2.8 0 0 1 14.13 13H5.87A2.8 2.8 0 0 1 3 10.24c0-1.47 1.2-2.67 2.7-2.76h.23C6.13 5.55 7.53 4 10 4" />
  </svg>
);

/** Fluent `notebook_16_regular`. */
export const FluentRefNotebookIcon = () => (
  <svg {...base}>
    <path d="M4.75 3a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h5.5c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75zM5 5V4h5v1zM2 2.75C2 1.78 2.78 1 3.75 1h7.5c.97 0 1.75.78 1.75 1.75v10.5c0 .97-.78 1.75-1.75 1.75h-7.5C2.78 15 2 14.22 2 13.25zM3.75 2a.75.75 0 0 0-.75.75v10.5c0 .41.34.75.75.75h7.5c.41 0 .75-.34.75-.75V2.75a.75.75 0 0 0-.75-.75zm10.88 2H14v2h.63c.2 0 .37-.17.37-.37V4.38c0-.21-.17-.38-.37-.38M14 7h.63c.2 0 .37.17.37.38v1.25c0 .2-.17.37-.37.37H14zm.63 3H14v2h.63c.2 0 .37-.17.37-.37v-1.26c0-.2-.17-.37-.37-.37" />
  </svg>
);

/** Fluent `notebook_16_filled`. */
export const FluentRefNotebookFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 1C2.78 1 2 1.78 2 2.75v10.5c0 .97.78 1.75 1.75 1.75h7.5c.97 0 1.75-.78 1.75-1.75V2.75C13 1.78 12.22 1 11.25 1zM4 3.75c0-.41.34-.75.75-.75h5.5c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75h-5.5A.75.75 0 0 1 4 4.25zM14 4h.63c.2 0 .37.17.37.38v1.25c0 .2-.17.37-.37.37H14zm.63 3H14v2h.63c.2 0 .37-.17.37-.37V7.37c0-.2-.17-.37-.37-.37M14 10h.63c.2 0 .37.17.37.38v1.24c0 .21-.17.38-.37.38H14z" />
  </svg>
);

/** Fluent `pentagon_20_regular`. */
export const FluentRefPentagonIcon = () => (
  <svg {...base}>
    <path d="M8.4 1.65a2.5 2.5 0 0 1 3.36 0l5.43 4.99c.73.67 1 1.7.68 2.64l-2.03 6.02a2.5 2.5 0 0 1-2.36 1.7H6.65c-1.05 0-2-.66-2.35-1.65L2.15 9.4a2.5 2.5 0 0 1 .67-2.7zm2.69.74a1.5 1.5 0 0 0-2.03 0L3.5 7.44a1.5 1.5 0 0 0-.4 1.62l2.15 5.95c.21.6.78.99 1.4.99h6.84a1.5 1.5 0 0 0 1.42-1.02l2.02-6.02a1.5 1.5 0 0 0-.4-1.58z" />
  </svg>
);

/** Fluent `pentagon_20_filled`. */
export const FluentRefPentagonFilledIcon = () => (
  <svg {...base}>
    <path d="M11.76 1.66a2.5 2.5 0 0 0-3.37-.01L2.82 6.7a2.5 2.5 0 0 0-.67 2.7l2.15 5.95A2.5 2.5 0 0 0 6.65 17h6.83a2.5 2.5 0 0 0 2.36-1.7l2.03-6.02a2.5 2.5 0 0 0-.68-2.64z" />
  </svg>
);

/** Fluent `folder_zip_16_regular`. */
export const FluentRefFolderZipIcon = () => (
  <svg {...base}>
    <path d="M5.59 2q.62.01 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v5a2.5 2.5 0 0 1-2 2.45v.67c0 .18-.13.34-.3.37l-.08.01H9.3a.4.4 0 0 1-.31-.38V14H3.5A2.5 2.5 0 0 1 1 11.5v-7A2.5 2.5 0 0 1 3.5 2zM11 11a1 1 0 0 0-1 .9V14h2v-2a1 1 0 0 0-1-1M6.65 6.56A1.5 1.5 0 0 1 5.59 7H2v4.5c0 .83.67 1.5 1.5 1.5H9v-1a2 2 0 1 1 4 0v.91c.58-.2 1-.76 1-1.41v-5c0-.83-.67-1.5-1.5-1.5H8.2zM12.5 9a.5.5 0 0 1 0 1H11V9zM11 9H9.5a.5.5 0 0 1 0-1H11zm1.5-2a.5.5 0 0 1 0 1H11V7zM11 7H9.5a.5.5 0 0 1 0-1H11zM3.5 3C2.67 3 2 3.67 2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3z" />
  </svg>
);

/** Fluent `folder_zip_16_filled`. */
export const FluentRefFolderZipFilledIcon = () => (
  <svg {...base}>
    <path d="M11 11a1 1 0 0 1 1 1v2.75q-.02.23-.25.25h-1.5a.25.25 0 0 1-.25-.25V11.9a1 1 0 0 1 1-.9m1.5-7A2.5 2.5 0 0 1 15 6.5v5a2.5 2.5 0 0 1-2 2.45V12a2 2 0 1 0-4 0v2H3.5A2.5 2.5 0 0 1 1 11.5V7h4.59q.62-.01 1.06-.44L9.2 4zM11 10h1.5a.5.5 0 0 0 0-1H11zM9.5 8a.5.5 0 0 0 0 1H11V8zM11 8h1.5a.5.5 0 0 0 0-1H11zM9.5 6a.5.5 0 0 0 0 1H11V6zM5.59 2q.62.01 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1V4.5A2.5 2.5 0 0 1 3.5 2z" />
  </svg>
);

/** Fluent `chat_help_16_regular`. */
export const FluentRefChatQuestionIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 1a6 6 0 0 0-5.07 9.2q.12.2.05.43l-.69 2.08 2.08-.7q.23-.06.42.06A6 6 0 1 0 8 2m0 8.5A.75.75 0 1 1 8 12a.75.75 0 0 1 0-1.5M8 4a2 2 0 0 1 1.67 3.09c-.17.25-.42.46-.57.6q-.26.24-.41.54c-.1.22-.19.53-.19 1.02a.5.5 0 0 1-1 0q0-.89.28-1.45c.18-.37.42-.62.62-.82.23-.21.35-.32.46-.47A1 1 0 0 0 9 6a1 1 0 1 0-2 0 .5.5 0 1 1-1 0c0-1.1.9-2 2-2" />
  </svg>
);

/** Fluent `chat_help_16_filled`. */
export const FluentRefChatQuestionFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 9.5A.75.75 0 1 0 8 12a.75.75 0 0 0 0-1.5M8 4a2 2 0 0 0-2 2 .5.5 0 0 0 1 0 1 1 0 0 1 2 0c0 .26-.06.4-.14.51-.1.15-.23.26-.46.47a2.8 2.8 0 0 0-.9 2.27.5.5 0 0 0 1 0c0-.49.08-.8.19-1.02q.15-.3.4-.53c.16-.15.4-.36.58-.61Q9.98 6.67 10 6a2 2 0 0 0-2-2" />
  </svg>
);

/** Fluent `plug_disconnected_16_regular`. */
export const FluentRefPlugOffIcon = () => (
  <svg {...base}>
    <path d="M15.35.65a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7M12.27 7.3l-.22.22c-.1.1-.26.1-.36 0L8.51 4.34a.25.25 0 0 1 0-.36l.13-.13a2.7 2.7 0 0 1 1.9-.79c.61 0 1.21.21 1.67.65a2.5 2.5 0 0 1 .06 3.59M8.15 9.15l-.88.88-1.3-1.3.88-.88a.5.5 0 0 0-.7-.7l-.88.88L5 7.77a1.25 1.25 0 0 0-1.76 0L3.03 8a3.47 3.47 0 0 0-.32 4.6L.65 14.63a.5.5 0 0 0 .7.71l2.08-2.07q.92.65 2.03.65c.94 0 1.89-.36 2.6-1.08l.14-.13c.48-.48.48-1.28 0-1.77l-.23-.22.88-.88a.5.5 0 0 0-.7-.7m-.66 2.87-.13.13c-1 1-2.6 1.06-3.57.14a2.5 2.5 0 0 1-.06-3.59l.22-.22a.3.3 0 0 1 .18-.07q.1 0 .18.07l3.18 3.18c.1.1.1.26 0 .36" />
  </svg>
);

/** Fluent `plug_disconnected_16_filled`. */
export const FluentRefPlugOffFilledIcon = () => (
  <svg {...base}>
    <path d="M15.35.65a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7m-7.2 8.5-.88.88-1.3-1.3.88-.88a.5.5 0 0 0-.7-.7l-.88.88L5 7.77a1.25 1.25 0 0 0-1.76 0L3.03 8a3.47 3.47 0 0 0-.32 4.6L.65 14.63a.5.5 0 0 0 .7.71l2.08-2.07q.92.65 2.03.65c.94 0 1.89-.36 2.6-1.08l.14-.13c.48-.48.48-1.28 0-1.77l-.23-.22.88-.88a.5.5 0 0 0-.7-.7" />
  </svg>
);

/** Fluent `target_arrow_16_regular`. */
export const FluentRefGoalIcon = () => (
  <svg {...base}>
    <path d="M11.7 1.04c.18.08.3.26.3.46V4h2.5a.5.5 0 0 1 .35.85l-2 2a.5.5 0 0 1-.35.15H9.7l-.73.74A1 1 0 1 1 7 8v-.05a1 1 0 0 1 1.26-.92L9 6.3V3.5a.5.5 0 0 1 .15-.35l2-2a.5.5 0 0 1 .54-.11M12.3 6l1-1h-1.8a.5.5 0 0 1-.5-.5V2.7l-1 1V6zm1.65 1.18q.05.4.05.82a6 6 0 1 1-5.18-5.94l-.38.38a2 2 0 0 0-.35.56H8a5 5 0 1 0 5 4.91q.31-.1.56-.35zM8 4.5A3.5 3.5 0 1 0 11.5 8h-1A2.5 2.5 0 1 1 8 5.5z" />
  </svg>
);

/** Fluent `target_arrow_16_filled`. */
export const FluentRefGoalFilledIcon = () => (
  <svg {...base}>
    <path d="M12 1.5a.5.5 0 0 0-.85-.35l-2 2A.5.5 0 0 0 9 3.5v2.8l-.74.73A1 1 0 0 0 7 8a1 1 0 1 0 1.97-.26L9.7 7h2.79a.5.5 0 0 0 .35-.15l2-2A.5.5 0 0 0 14.5 4H12zm1.94 5.68q.06.4.06.82a6 6 0 1 1-5.18-5.94l-.38.38A1.5 1.5 0 0 0 8 3.5 4.5 4.5 0 1 0 12.5 8q.62-.01 1.06-.44zM8 4.5A3.5 3.5 0 1 0 11.5 8h-1.38l-.12.13A2 2 0 1 1 7.87 6L8 5.88z" />
  </svg>
);

/** Fluent `radar_20_regular`. */
export const FluentRefRadarIcon = () => (
  <svg {...base}>
    <path d="m14.5 3.38-.72.72a7 7 0 1 0 1.17 10.85.5.5 0 0 1 .7.7A8 8 0 1 1 14.5 3.39m-2.94 2.94.75-.75a5 5 0 1 0 1.23 7.97.5.5 0 1 0-.71-.71 4 4 0 1 1-1.27-6.51m4.3-2.17c.19.2.19.5 0 .7l-4.9 4.9a1 1 0 1 1-.7-.72l4.89-4.88c.2-.2.5-.2.7 0M17 13.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M16.5 7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1.5 4.25a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5-2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-2.5 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5-2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
  </svg>
);

/** Fluent `radar_20_filled`. */
export const FluentRefRadarFilledIcon = () => (
  <svg {...base}>
    <path d="m14.28 3.24-1.09 1.1a6.5 6.5 0 1 0 1.4 10.26.75.75 0 0 1 1.07 1.06 8 8 0 1 1-1.38-12.42m-3.3 3.3 1.17-1.17a5.1 5.1 0 1 0 1.46 8.24.75.75 0 1 0-1.06-1.06 3.6 3.6 0 1 1-1.56-6.01m4.8-2.32c.3.3.3.77 0 1.06l-4.33 4.33a1.5 1.5 0 1 1-1.06-1.06l4.33-4.33c.3-.3.77-.3 1.06 0m1.47 9.03a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M16.5 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.75-1.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M15 11.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.75-1.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `broom_16_regular`. */
export const FluentRefBroomIcon = () => (
  <svg {...base}>
    <path d="M14.85 1.15a.5.5 0 0 0-.7 0L9.48 5.82a3.7 3.7 0 0 0-4.83.37l-.68.64-2.68 1.21a.5.5 0 0 0-.14.81l6 6a.5.5 0 0 0 .8-.14l1.22-2.67.68-.69a3.7 3.7 0 0 0 .33-4.83l4.67-4.67a.5.5 0 0 0 0-.7m-10.7 6.7 4 4-.8 1.79-4.99-4.98zm4.6 3.2L4.97 7.25l.37-.34.01-.02a2.67 2.67 0 1 1 3.8 3.75z" />
  </svg>
);

/** Fluent `broom_16_filled`. */
export const FluentRefBroomFilledIcon = () => (
  <svg {...base}>
    <path d="M14.85 1.15c.2.2.2.5 0 .7L10.9 5.81a5 5 0 0 0-.71-.7l3.96-3.96c.2-.2.5-.2.7 0M4.65 6.19l-.39.36 5.2 5.2.4-.4a3.67 3.67 0 1 0-5.2-5.16M1.3 8.04l2.1-.95 5.52 5.52-.95 2.1a.5.5 0 0 1-.81.14l-6-6a.5.5 0 0 1 .14-.8" />
  </svg>
);

/** Fluent `edit_off_16_regular`. */
export const FluentRefPencilOffIcon = () => (
  <svg {...base}>
    <path d="M5.8 6.5 1.14 1.85a.5.5 0 1 1 .7-.7l13 13a.5.5 0 0 1-.7.7L9.5 10.21l-3.14 3.13q-.57.57-1.35.78l-3.39.86a.5.5 0 0 1-.6-.6l.86-3.39q.21-.78.78-1.35zm3 3L6.5 7.2l-3.14 3.14q-.37.38-.5.9l-.67 2.57 2.57-.66q.52-.15.9-.51zm3.24-3.25-1.83 1.84.7.7 3.33-3.32a2.62 2.62 0 0 0-3.71-3.7L7.2 5.08l.7.7 1.84-1.83zm-.8-3.78a1.62 1.62 0 1 1 2.29 2.3l-.78.77-2.3-2.29z" />
  </svg>
);

/** Fluent `edit_off_16_filled`. */
export const FluentRefPencilOffFilledIcon = () => (
  <svg {...base}>
    <path d="m9.5 10.2 4.65 4.65a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L5.79 6.5 2.66 9.64q-.57.57-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86q.78-.21 1.35-.78zm3.25-3.24-1.84 1.83-3.7-3.7 1.83-1.84zm-2.22-5.2a2.62 2.62 0 1 1 3.7 3.71l-.77.78-3.71-3.7z" />
  </svg>
);

/** Fluent `flash_off_20_regular`. */
export const FluentRefZapOffIcon = () => (
  <svg {...base}>
    <path d="M5.27 5.98 2.15 2.85a.5.5 0 1 1 .7-.7l15 15a.5.5 0 0 1-.7.7l-5.3-5.29-5 5.11c-.75.79-2.05.06-1.8-1L6.24 12H4.96c-.7 0-1.21-.68-1.02-1.36zm5.88 5.88L6.08 6.79 4.9 10.92q0 .07.06.08h1.9a.5.5 0 0 1 .5.62l-1.33 5.3v.04l.03.03.04.01h.01l.02-.02zm3.66-3.74-2.26 2.3.7.72 2.28-2.32c.65-.68.18-1.82-.76-1.82H12.2l1.27-3.6c.23-.69-.28-1.4-1.01-1.4H7.21c-.47 0-.89.31-1.02.77L5.9 3.78l.81.8.44-1.53q0-.05.06-.05h5.25q.07.01.06.08l-1.5 4.25a.5.5 0 0 0 .48.67h3.3l.02.04.01.05z" />
  </svg>
);

/** Fluent `flash_off_20_filled`. */
export const FluentRefZapOffFilledIcon = () => (
  <svg {...base}>
    <path d="m11.86 12.56 5.29 5.3a.5.5 0 0 0 .7-.71l-15-15a.5.5 0 1 0-.7.7l3.12 3.13-1.33 4.66c-.2.68.32 1.36 1.02 1.36h1.27l-1.17 4.68c-.26 1.05 1.04 1.78 1.8 1zm3.67-3.74-2.27 2.32L5.9 3.78l.29-1C6.32 2.3 6.74 2 7.21 2h5.25c.73 0 1.24.71 1 1.4L12.2 7h2.57c.94 0 1.4 1.14.76 1.81" />
  </svg>
);

/** Fluent `location_off_16_regular`. */
export const FluentRefLocationOffIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7l-2.66-2.65a24 24 0 0 1-2.33 2.36c-.67.59-1.65.59-2.32 0C5.1 13.02 2 9.87 2 7c0-1.22.37-2.35 1-3.3L1.14 1.85a.5.5 0 0 1 0-.7M3.7 4.42A5 5 0 0 0 3 7c0 1.1.61 2.4 1.57 3.68a21 21 0 0 0 2.93 3.13c.3.25.7.25 1 0 .66-.58 1.5-1.4 2.28-2.32l-2.3-2.3q-.23.06-.48.06a2.25 2.25 0 0 1-2.2-2.74zM8 1a6 6 0 0 1 6 6c0 1.2-.54 2.44-1.29 3.59L12 9.86C12.6 8.86 13 7.87 13 7a5 5 0 0 0-7.93-4.05l-.71-.72A6 6 0 0 1 8 1m0 3.75a2.25 2.25 0 0 1 2.05 3.18l-.8-.8V7a1.25 1.25 0 0 0-1.37-1.24l-.8-.8q.42-.21.92-.21" />
  </svg>
);

/** Fluent `location_off_16_filled`. */
export const FluentRefLocationOffFilledIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7l-2.66-2.65c-.81.94-1.67 1.76-2.33 2.34-.67.6-1.65.6-2.32 0C5.1 13.01 2 9.88 2 7c0-1.22.37-2.35 1-3.3L1.14 1.85a.5.5 0 0 1 0-.7M8 1a6 6 0 0 1 6 6c0 1.2-.54 2.44-1.29 3.59L9.86 7.74a2 2 0 0 0-2.6-2.6l-2.9-2.9A6 6 0 0 1 8 1M6.02 6.73a2 2 0 0 0 2.25 2.25z" />
  </svg>
);

/** Fluent `chat_off_16_regular`. */
export const FluentRefChatOffIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7l-1.57-1.56a7 7 0 0 1-8.12.75l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8a7 7 0 0 1 .75-8.12L1.15 1.85a.5.5 0 0 1 0-.7m2.27 2.98a6 6 0 0 0-.49 7.08q.12.2.05.42l-.69 2.08 2.08-.7q.23-.06.42.06a6 6 0 0 0 7.08-.49l-2.9-2.9a.5.5 0 0 1-.47.32h-3a.5.5 0 0 1 0-1h2.8l-2-2h-.8a.5.5 0 0 1-.17-.97zM8 1a7 7 0 0 1 5.9 10.77l-.73-.72Q13.98 9.68 14 8a6 6 0 0 0-9.05-5.17l-.72-.73A7 7 0 0 1 8 1m2.5 5a.5.5 0 1 1 0 1H9.12l-1-1z" />
  </svg>
);

/** Fluent `chat_off_16_filled`. */
export const FluentRefChatOffFilledIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7l-1.57-1.56a7 7 0 0 1-8.12.75l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8a7 7 0 0 1 .75-8.12L1.15 1.85a.5.5 0 0 1 0-.7M8 1a7 7 0 0 1 5.9 10.77L9.11 7h1.38a.5.5 0 0 0 0-1H8.12l-3.9-3.9A7 7 0 0 1 8 1M5.5 9a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .47-.33L8.29 9zm-.17-2.97A.5.5 0 0 0 5.5 7h.8z" />
  </svg>
);

/** Fluent `share_screen_stop_16_regular`. */
export const FluentRefScreenShareOffIcon = () => (
  <svg {...base}>
    <path d="M5.15 5.15c.2-.2.5-.2.7 0L8 7.29l2.15-2.14a.5.5 0 0 1 .7.7L8.71 8l2.14 2.15a.5.5 0 0 1-.7.7L8 8.71l-2.15 2.14a.5.5 0 0 1-.7-.7L7.29 8 5.15 5.85a.5.5 0 0 1 0-.7M1 5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `share_screen_stop_16_filled`. */
export const FluentRefScreenShareOffFilledIcon = () => (
  <svg {...base}>
    <path d="M3 3a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm2.15 2.15c.2-.2.5-.2.7 0L8 7.29l2.15-2.14a.5.5 0 0 1 .7.7L8.71 8l2.14 2.15a.5.5 0 0 1-.7.7L8 8.71l-2.15 2.14a.5.5 0 0 1-.7-.7L7.29 8 5.15 5.85a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `bookmark_off_20_regular`. */
export const FluentRefBookmarkOffIcon = () => (
  <svg {...base}>
    <path d="M4 4.7 2.15 2.86a.5.5 0 1 1 .7-.7l15 15a.5.5 0 0 1-.7.7L16 16.71v.79a.5.5 0 0 1-.8.4L10 14.12 4.8 17.9a.5.5 0 0 1-.8-.4zm11 11L5 5.7v10.82l4.7-3.42a.5.5 0 0 1 .6 0l4.7 3.42zm0-11.2v8.38l1 1V4.5A2.5 2.5 0 0 0 13.5 2h-7a2.5 2.5 0 0 0-1.7.67l.7.71a1.5 1.5 0 0 1 1-.38h7c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `bookmark_off_20_filled`. */
export const FluentRefBookmarkOffFilledIcon = () => (
  <svg {...base}>
    <path d="m16 16.7 1.15 1.15a.5.5 0 0 0 .7-.7l-15-15a.5.5 0 1 0-.7.7L4 4.71V17.5a.5.5 0 0 0 .8.4l5.2-3.78 5.2 3.78a.5.5 0 0 0 .8-.4zm0-12.2v9.38L4.8 2.68A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5" />
  </svg>
);

/** Fluent `heart_off_16_regular`. */
export const FluentRefHeartOffIcon = () => (
  <svg {...base}>
    <path d="m10.45 11.16 3.7 3.7a.5.5 0 0 0 .7-.71l-13-13a.5.5 0 1 0-.7.7L3.09 3.8l-.14.14a3.25 3.25 0 0 0 0 4.6l4.72 4.7c.19.2.5.2.7 0zm-.7-.7-1.73 1.72-4.36-4.36a2.25 2.25 0 0 1 .14-3.31zm2.6-2.6-1.19 1.18.7.7 1.2-1.18a3.25 3.25 0 0 0-4.61-4.6l-.46.44-.45-.45a3.3 3.3 0 0 0-2.43-.96L6.5 4.38q.18.12.33.27l.81.81c.2.2.53.2.72 0l.79-.8c.88-.88 2.3-.87 3.19.01.88.88.88 2.3 0 3.18" />
  </svg>
);

/** Fluent `heart_off_16_filled`. */
export const FluentRefHeartOffFilledIcon = () => (
  <svg {...base}>
    <path d="m10.45 11.16 3.7 3.7a.5.5 0 0 0 .7-.71l-13-13a.5.5 0 1 0-.7.7L3.09 3.8l-.14.14a3.25 3.25 0 0 0 0 4.6l4.72 4.7c.19.2.5.2.7 0zm2.6-2.6-1.18 1.19L5.1 2.99c.88-.03 1.76.29 2.43.96L8 4.4l.45-.45a3.25 3.25 0 0 1 4.62 4.6" />
  </svg>
);

/** Fluent `flag_off_16_regular`. */
export const FluentRefFlagOffIcon = () => (
  <svg {...base}>
    <path d="m9.3 10 4.85 4.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L3 3.71v9.79a.5.5 0 0 0 1 0V10zm-1-1H4V4.7zm3.73 0h-.9l1 1H13a.5.5 0 0 0 .4-.8L11.12 6l2.3-3.2A.5.5 0 0 0 13 2H4.12l1 1h6.9L10.1 5.7a.5.5 0 0 0 0 .6z" />
  </svg>
);

/** Fluent `flag_off_16_filled`. */
export const FluentRefFlagOffFilledIcon = () => (
  <svg {...base}>
    <path d="m9.3 10 4.85 4.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L3 3.71v9.79a.5.5 0 0 0 1 0V10zm3.7 0h-.88l-8-8H13c.4 0 .64.46.4.8L11.12 6l2.3 3.2a.5.5 0 0 1-.41.8" />
  </svg>
);

/** Fluent `bluetooth_disabled_20_regular`. */
export const FluentRefBluetoothOffIcon = () => (
  <svg {...base}>
    <path d="m13.5 14.2 3.65 3.65a.5.5 0 0 0 .7-.7l-15-15a.5.5 0 1 0-.7.7L9 9.71v.06l-3.83 3.35a.5.5 0 0 0 .66.76L9 11.1v6.4a.5.5 0 0 0 .85.35zm.33-7.32-2.58 2.25-.7-.7 2.22-1.95L10 3.7v4.17l-1-1V2.5a.5.5 0 0 1 .85-.35l4 4a.5.5 0 0 1-.02.73M10 11.1l2.77 2.42L10 16.3z" />
  </svg>
);

/** Fluent `bluetooth_disabled_20_filled`. */
export const FluentRefBluetoothOffFilledIcon = () => (
  <svg {...base}>
    <path d="m13.68 14.38 3.47 3.47a.5.5 0 0 0 .7-.7l-15-15a.5.5 0 1 0-.7.7l6.81 6.82-3.68 3a.75.75 0 0 0 .94 1.16L9 11.58v5.67a.75.75 0 0 0 1.28.53zm-1.21-1.2.15.14-2.12 2.12v-3.86zm1.75-5.85L11.6 9.47 10.53 8.4l2.1-1.7-2.13-2.14v3.82L9 6.88V2.75a.75.75 0 0 1 1.28-.53l4 4a.75.75 0 0 1-.06 1.11" />
  </svg>
);

/** Fluent `cloud_error_16_regular`. */
export const FluentRefCloudAlertIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.77q.05.51.19 1h-.96a3.25 3.25 0 0 1-.22-6.5 4 4 0 0 1 7.89-.32q-.52-.14-1.09-.17A3 3 0 0 0 8 3m7 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M10.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5m0 5.13a.62.62 0 1 0 0-1.25.62.62 0 0 0 0 1.24" />
  </svg>
);

/** Fluent `cloud_error_16_filled`. */
export const FluentRefCloudAlertFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.89-.32A5.5 5.5 0 0 0 5.2 12h-.96a3.25 3.25 0 0 1-.22-6.5m10.97 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M10.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5m0 5.13a.62.62 0 1 0 0-1.25.62.62 0 0 0 0 1.24" />
  </svg>
);

/** Fluent `clock_warning_16_regular`. */
export const FluentRefClockAlertIcon = () => (
  <svg {...base}>
    <path d="M3.6 7.55a1 1 0 0 1 1.8 0l3.5 7A1 1 0 0 1 8 16H1a1 1 0 0 1-.9-1.45zM4.5 14a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M9 0a7 7 0 0 1 .72 13.96L9.24 13A6 6 0 1 0 3 6.67q-.17.18-.3.44l-.59 1.18A7 7 0 0 1 9 0M4.5 9a.5.5 0 0 0-.5.5v3a.5.5 0 1 0 1 0v-3a.5.5 0 0 0-.5-.5m4-6c.28 0 .5.22.5.5V7h2.5a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-4c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `clock_warning_16_filled`. */
export const FluentRefClockAlertFilledIcon = () => (
  <svg {...base}>
    <path d="M3.6 7.55a1 1 0 0 1 1.8 0l3.5 7A1 1 0 0 1 8 16H1a1 1 0 0 1-.9-1.45zM4.5 14a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M9 0a7 7 0 0 1 .72 13.96L6.29 7.11a2 2 0 0 0-3.58 0l-.59 1.18A7 7 0 0 1 9 0M4.5 9a.5.5 0 0 0-.5.5v3a.5.5 0 1 0 1 0v-3a.5.5 0 0 0-.5-.5m4-6a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h3a.5.5 0 1 0 0-1H9V3.5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `shield_person_20_regular`. */
export const FluentRefShieldUserIcon = () => (
  <svg {...base}>
    <path d="M10 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5c2.5 0 3.5-1.26 3.5-2.5 0-.83-.67-1.5-1.5-1.5H8c-.83 0-1.5.67-1.5 1.5 0 1.25 1 2.5 3.5 2.5m.28-12.42a.5.5 0 0 0-.56 0 15 15 0 0 1-6.3 2.43A.5.5 0 0 0 3 5v4.5q.02 5.86 6.82 8.47a.5.5 0 0 0 .36 0C14.69 16.23 17 13.39 17 9.5V5a.5.5 0 0 0-.43-.5 15 15 0 0 1-6.3-2.42M4 5.43a16 16 0 0 0 5.6-2.08l.4-.25.4.25A16 16 0 0 0 16 5.43V9.5c0 3.4-1.97 5.86-6 7.46-4.03-1.6-6-4.07-6-7.46z" />
  </svg>
);

/** Fluent `shield_person_20_filled`. */
export const FluentRefShieldUserFilledIcon = () => (
  <svg {...base}>
    <path d="M10.28 2.08a.5.5 0 0 0-.56 0 15 15 0 0 1-6.3 2.43A.5.5 0 0 0 3 5v4.5q.02 5.86 6.82 8.47a.5.5 0 0 0 .36 0C14.69 16.23 17 13.39 17 9.5V5a.5.5 0 0 0-.43-.5 15 15 0 0 1-6.3-2.42M10 9.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 5c-2.5 0-3.5-1.25-3.5-2.5 0-.83.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5 0 1.24-1 2.5-3.5 2.5" />
  </svg>
);

/** Fluent `shield_dismiss_16_regular`. */
export const FluentRefShieldXIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4a.5.5 0 0 1 .5.41V7.5c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.74 12.94 3.1 10.85 3 7.8V4.5c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M8 3.19a6.7 6.7 0 0 1-3.71 1.76L4 4.98V7.5c0 2.64 1.22 4.4 3.74 5.37l.26.1.26-.1Q11.9 11.5 12 7.77V4.98a6.6 6.6 0 0 1-4-1.8M6.09 6.22l.06-.07a.5.5 0 0 1 .64-.06l.07.06L8 7.29l1.15-1.14a.5.5 0 0 1 .64-.06l.07.06c.17.17.19.44.05.63l-.06.07L8.71 8l1.14 1.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71 6.85 9.85a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L7.29 8 6.15 6.85a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

/** Fluent `shield_dismiss_16_filled`. */
export const FluentRefShieldXFilledIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v3c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.64 12.91 3 10.72 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M6.53 5.84a.5.5 0 0 0-.63.06l-.06.07a.5.5 0 0 0 .06.63L7.3 8 5.9 9.4l-.06.07a.5.5 0 0 0 .06.63l.07.06c.2.14.46.12.63-.06L8 8.7l1.4 1.4.07.06c.2.14.46.12.63-.06l.06-.07a.5.5 0 0 0-.06-.63L8.7 8l1.4-1.4.06-.07a.5.5 0 0 0-.06-.63l-.07-.06a.5.5 0 0 0-.63.06L8 7.3 6.6 5.9z" />
  </svg>
);

/** Fluent `shield_add_16_regular`. */
export const FluentRefShieldPlusIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-.48-.24-1-.4v-.22a6.6 6.6 0 0 1-4-1.8 6.7 6.7 0 0 1-4 1.8V7.5q.02 2.13 1.02 3.44.08 1 .48 1.86Q3 10.98 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H11z" />
  </svg>
);

/** Fluent `shield_add_16_filled`. */
export const FluentRefShieldPlusFilledIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-1.14-.58-2.5-.6a5.5 5.5 0 0 0-5 7.8Q3 10.98 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H11z" />
  </svg>
);

/** Fluent `mail_add_16_regular`. */
export const FluentRefMailPlusIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H11zm1 9.5v-2.2q.52-.15 1-.4V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h2.02a6 6 0 0 0 0 1H3a1 1 0 0 0-1 1v.74l5 2.7.54-.3q.53.33 1.1.54l-1.4.76a.5.5 0 0 1-.48 0L2 8.88V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1" />
  </svg>
);

/** Fluent `mail_add_16_filled`. */
export const FluentRefMailPlusFilledIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H11zm-.5 7.5q1.36-.02 2.5-.6V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8.34l5.76 3.1a.5.5 0 0 0 .48 0l1.4-.76q.89.31 1.86.32M3 5h2.02L5 5.5a5.5 5.5 0 0 0 2.54 4.64l-.54.3L1 7.2V7c0-1.1.9-2 2-2" />
  </svg>
);

/** Fluent `person_delete_16_regular`. */
export const FluentRefPersonXIcon = () => (
  <svg {...base}>
    <path d="M9.5 9c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C1 9.67 1.67 9 2.5 9zm0 1h-7a.5.5 0 0 0-.5.5v.5c0 1.44 1.43 3 4 3s4-1.56 4-3v-.5a.5.5 0 0 0-.5-.5M6 2.5A2.75 2.75 0 1 1 6 8a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 6 7a1.75 1.75 0 0 0 0-3.5m4.78-2.41.07.06 1.65 1.64 1.65-1.64a.5.5 0 0 1 .7.7L13.21 3.5l1.64 1.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06-1.65-1.64-1.65 1.64a.5.5 0 0 1-.7-.7l1.64-1.65-1.64-1.65a.5.5 0 0 1-.06-.63l.06-.07a.5.5 0 0 1 .56-.1z" />
  </svg>
);

/** Fluent `person_delete_16_filled`. */
export const FluentRefPersonXFilledIcon = () => (
  <svg {...base}>
    <path d="M9.5 9c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C1 9.67 1.67 9 2.5 9zM6 2.5A2.75 2.75 0 1 1 6 8a2.75 2.75 0 0 1 0-5.5m4.78-1.41.07.06 1.65 1.64 1.65-1.64a.5.5 0 0 1 .7.7L13.21 3.5l1.64 1.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06-1.65-1.64-1.65 1.64a.5.5 0 0 1-.7-.7l1.64-1.65-1.64-1.65a.5.5 0 0 1-.06-.63l.06-.07a.5.5 0 0 1 .56-.1z" />
  </svg>
);

/** Fluent `person_key_16_regular`. */
export const FluentRefPersonKeyIcon = () => (
  <svg {...base}>
    <path d="M12 6a3 3 0 1 1-1 5.83v.67a.5.5 0 0 1-.5.5H10v.5a.5.5 0 0 1-.5.5H9v.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.09a1 1 0 0 1 .3-.7l2.83-2.84A3 3 0 0 1 12 6M8.13 8A4 4 0 0 0 8 9H3.5a.5.5 0 0 0-.5.5v.5c0 1.04.75 2.15 2.14 2.68a2 2 0 0 0-.14.73v.28C3.09 13.05 2 11.5 2 10v-.5C2 8.67 2.67 8 3.5 8zm4.62-.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M7 1.5A2.75 2.75 0 1 1 7 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 7 6a1.75 1.75 0 0 0 0-3.5" />
  </svg>
);

/** Fluent `person_key_16_filled`. */
export const FluentRefPersonKeyFilledIcon = () => (
  <svg {...base}>
    <path d="M12 6a3 3 0 1 1-1 5.83v.67a.5.5 0 0 1-.5.5H10v.5a.5.5 0 0 1-.5.5H9v.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.09a1 1 0 0 1 .3-.7l2.83-2.84A3 3 0 0 1 12 6M8.13 8a4 4 0 0 0-.1 1.55L5.6 12A2 2 0 0 0 5 13.41v.28C3.09 13.05 2 11.5 2 10v-.5C2 8.67 2.67 8 3.5 8zm4.62-.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M7 1.5A2.75 2.75 0 1 1 7 7a2.75 2.75 0 0 1 0-5.5" />
  </svg>
);

/** Fluent `document_settings_16_regular`. */
export const FluentRefFileCogIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.2q.48-.13 1-.18V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1H9.74q-.47.58-1.08 1H12a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06l-2.91-2.91A1.5 1.5 0 0 0 9.59 1zm6.8 4h-2.3a.5.5 0 0 1-.5-.5V2.2zM1.62 9.92a2 2 0 0 0 1.43-2.48l-.15-.55q.38-.3.82-.5l.34.36a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52L8 7.34a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.44 2.48l.16.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01zm4.87.58a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
  </svg>
);

/** Fluent `document_settings_16_filled`. */
export const FluentRefFileCogFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1v3.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5H8.66A5.5 5.5 0 0 0 4 5.2V2.5C4 1.67 4.67 1 5.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zM1.63 9.92a2 2 0 0 0 1.43-2.48l-.15-.55q.38-.3.82-.5l.34.36a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52L8 7.34a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.44 2.48l.16.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01zm4.87.58a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
  </svg>
);

/** Fluent `document_arrow_down_16_regular`. */
export const FluentRefFileDownloadIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.58q.62.01 1.06.44l2.92 2.92q.43.44.44 1.06V13a2 2 0 0 1-2 2H8.67q.6-.43 1.07-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6-.79v2.3c0 .27.22.5.5.5h2.3zm0 8.29a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85 2.35a.5.5 0 0 0 .35.15.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.7-.7L6 11.29V8.5a.5.5 0 0 0-1 0v2.8l-1.15-1.15a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `document_arrow_down_16_filled`. */
export const FluentRefFileDownloadFilledIcon = () => (
  <svg {...base}>
    <path d="M9 1H6a2 2 0 0 0-2 2v2.2A5.5 5.5 0 0 1 8.67 15H12a2 2 0 0 0 2-2V6h-3.5A1.5 1.5 0 0 1 9 4.5zm5 4h-3.5a.5.5 0 0 1-.5-.5V1zm-4 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.85 2.35a.5.5 0 0 0 .35.15.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.7-.7L6 11.29V8.5a.5.5 0 0 0-1 0v2.8l-1.15-1.15a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `password_16_regular`. */
export const FluentRefPasswordIcon = () => (
  <svg {...base}>
    <path d="M5.85 6.15a.5.5 0 0 0-.7 0l-.65.64-.65-.64a.5.5 0 1 0-.7.7l.64.65-.64.65a.5.5 0 1 0 .7.7l.65-.64.65.64a.5.5 0 1 0 .7-.7l-.64-.65.64-.65a.5.5 0 0 0 0-.7m3.3 0a.5.5 0 1 1 .7.7l-.64.65.64.65a.5.5 0 0 1-.7.7l-.65-.64-.65.64a.5.5 0 1 1-.7-.7l.64-.65-.64-.65a.5.5 0 1 1 .7-.7l.65.64zM11.5 8a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm-8-5A2.5 2.5 0 0 0 1 5.5v4A2.5 2.5 0 0 0 3.5 12h9A2.5 2.5 0 0 0 15 9.5v-4A2.5 2.5 0 0 0 12.5 3zM2 5.5C2 4.67 2.67 4 3.5 4h9c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 9.5z" />
  </svg>
);

/** Fluent `password_16_filled`. */
export const FluentRefPasswordFilledIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm4.15.65-.65.64-.65-.64a.5.5 0 1 0-.7.7l.64.65-.64.65a.5.5 0 1 0 .7.7l.65-.64.65.64a.5.5 0 1 0 .7-.7l-.64-.65.64-.65a.5.5 0 1 0-.7-.7m4 0-.65.64-.65-.64a.5.5 0 1 0-.7.7l.64.65-.64.65a.5.5 0 1 0 .7.7l.65-.64.65.64a.5.5 0 1 0 .7-.7l-.64-.65.64-.65a.5.5 0 0 0-.7-.7M11 8.5c0 .28.22.5.5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `speaker_1_16_regular`. */
export const FluentRefVolumeLowIcon = () => (
  <svg {...base}>
    <path d="M8.7 2.04q.29.14.3.46v11a.5.5 0 0 1-.85.36l-2.93-2.88H3.5A1.5 1.5 0 0 1 2 9.48V6.5C2 5.66 2.67 5 3.5 5h1.72l2.93-2.85a.5.5 0 0 1 .54-.1M8 3.69 5.78 5.85a.5.5 0 0 1-.35.14H3.5a.5.5 0 0 0-.5.5v3c0 .27.22.5.5.5h1.93a.5.5 0 0 1 .35.13L8 12.32zm2.11 1.5a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m.08.7Z" />
  </svg>
);

/** Fluent `speaker_1_16_filled`. */
export const FluentRefVolumeLowFilledIcon = () => (
  <svg {...base}>
    <path d="M9 2.5a.5.5 0 0 0-.85-.36L5.22 5H3.5C2.67 5 2 5.66 2 6.5v3c0 .82.67 1.5 1.5 1.5h1.72l2.93 2.87A.5.5 0 0 0 9 13.5zm1.11 2.69a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m.08.7Z" />
  </svg>
);

/** Fluent `merge_16_regular`. */
export const FluentRefMergeIcon = () => (
  <svg {...base}>
    <path d="M11.5 7.5H9.88a2.5 2.5 0 0 1-1.9-.87l-1.5-1.76A2.5 2.5 0 0 0 4.58 4H2.5a.5.5 0 0 0 0 1h2.08c.44 0 .85.2 1.14.52l1.5 1.76q.38.44.86.72-.48.3-.86.72l-1.5 1.76c-.29.33-.7.52-1.14.52H2.5a.5.5 0 0 0 0 1h2.08a2.5 2.5 0 0 0 1.9-.87l1.5-1.76a2.5 2.5 0 0 1 1.9-.87h2.53l-2.29 2.67a.5.5 0 1 0 .76.66l3-3.5a.5.5 0 0 0 0-.66l-3-3.5a.5.5 0 1 0-.76.66l2.3 2.67z" />
  </svg>
);

/** Fluent `merge_16_filled`. */
export const FluentRefMergeFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.25c0-.41.34-.75.75-.75h1.79c.83 0 1.62.38 2.15 1.03l1.5 1.88c.42.53 1.07.84 1.75.84h1.79l-1.57-2.04a.75.75 0 0 1 1.18-.92l2.5 3.25c.21.27.21.65 0 .92l-2.5 3.25a.75.75 0 0 1-1.18-.92l1.57-2.04H9.7c-.38 0-.74.17-.97.47l-1.5 1.87A3.8 3.8 0 0 1 4.3 12.5H2.75a.75.75 0 0 1 0-1.5h1.56c.68 0 1.33-.31 1.76-.84l1.5-1.88.2-.22q-.43-.3-.76-.72l-1.5-1.87c-.23-.3-.6-.47-.97-.47H2.75A.75.75 0 0 1 2 4.25" />
  </svg>
);

/** Fluent `copy_add_20_regular`. */
export const FluentRefDuplicateIcon = () => (
  <svg {...base}>
    <path d="M14.5 10a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9M7 7H5.5C4.67 7 4 7.67 4 8.5v6c0 .83.67 1.5 1.5 1.5h3.7q.15.52.4 1H5.5A2.5 2.5 0 0 1 3 14.5v-6A2.5 2.5 0 0 1 5.5 6H7zm7.5 5a.5.5 0 0 0-.5.5V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15v-1.5a.5.5 0 0 0-.5-.5m0-9A2.5 2.5 0 0 1 17 5.5v4.1q-.48-.25-1-.4V5.5c0-.83-.67-1.5-1.5-1.5h-4C9.67 4 9 4.67 9 5.5v6q.01.58.38 1-.2.5-.3 1.06A2.5 2.5 0 0 1 8 11.5v-6A2.5 2.5 0 0 1 10.5 3z" />
  </svg>
);

/** Fluent `copy_add_20_filled`. */
export const FluentRefDuplicateFilledIcon = () => (
  <svg {...base}>
    <path d="M14.5 10a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9M7 11.5c0 1.4.82 2.6 2 3.16q.05 1.27.6 2.34H5.5A2.5 2.5 0 0 1 3 14.5v-6A2.5 2.5 0 0 1 5.5 6H7zm7.5.5a.5.5 0 0 0-.5.5V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15v-1.5a.5.5 0 0 0-.5-.5m0-9A2.5 2.5 0 0 1 17 5.5v4.1q-1.14-.59-2.5-.6a5.5 5.5 0 0 0-5.42 4.56A2.5 2.5 0 0 1 8 11.5v-6A2.5 2.5 0 0 1 10.5 3z" />
  </svg>
);

/** Fluent `toggle_left_16_regular`. */
export const FluentRefToggleOffIcon = () => (
  <svg {...base}>
    <path d="M5 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4m10-2a4 4 0 0 0-4-4H5a4 4 0 1 0 0 8h6a4 4 0 0 0 4-4m-4-3a3 3 0 1 1 0 6H5a3 3 0 0 1 0-6z" />
  </svg>
);

/** Fluent `toggle_left_16_filled`. */
export const FluentRefToggleOffFilledIcon = () => (
  <svg {...base}>
    <path d="M11 4a4 4 0 0 1 0 8H5a4 4 0 0 1 0-8zm-6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
  </svg>
);

/** Fluent `share_android_16_regular`. */
export const FluentRefShareNodesIcon = () => (
  <svg {...base}>
    <path d="M12 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 .5 1.31L5.95 7.58a2 2 0 0 1 0 .84l4.53 2.27a2 2 0 1 1-.45.9L5.51 9.3A2 2 0 0 1 2 8a2 2 0 0 1 3.5-1.31l4.54-2.27A2 2 0 0 1 10 4M3 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0m8 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

/** Fluent `share_android_16_filled`. */
export const FluentRefShareNodesFilledIcon = () => (
  <svg {...base}>
    <path d="M10 4a2 2 0 1 1 .5 1.31L5.95 7.58a2 2 0 0 1 0 .84l4.53 2.27A2 2 0 0 1 14 12a2 2 0 1 1-3.96-.42L5.51 9.31A2 2 0 0 1 2 8a2 2 0 0 1 3.5-1.31l4.54-2.27A2 2 0 0 1 10 4" />
  </svg>
);

/** Fluent `branch_fork_16_regular`. */
export const FluentRefGitForkIcon = () => (
  <svg {...base}>
    <path d="M5 5.95a2.5 2.5 0 1 0-1 0v4.1a2.5 2.5 0 1 0 1 0V9h4.5A2.5 2.5 0 0 0 12 6.5v-.55a2.5 2.5 0 1 0-1 0v.55c0 .83-.67 1.5-1.5 1.5H5zM4.5 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M6 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
  </svg>
);

/** Fluent `branch_fork_16_filled`. */
export const FluentRefGitForkFilledIcon = () => (
  <svg {...base}>
    <path d="M7 3.5a2.5 2.5 0 0 1-2 2.45V8h4.5c.83 0 1.5-.67 1.5-1.5v-.55a2.5 2.5 0 1 1 1 0v.55A2.5 2.5 0 0 1 9.5 9H5v1.05a2.5 2.5 0 1 1-1 0v-4.1A2.5 2.5 0 1 1 7 3.5" />
  </svg>
);

/** Fluent `branch_compare_16_regular`. */
export const FluentRefGitCompareIcon = () => (
  <svg {...base}>
    <path d="M9.15 5.85a.5.5 0 1 0 .7-.7L8.71 4h1.79c.83 0 1.5.67 1.5 1.5v4.55a2.5 2.5 0 1 0 1 0V5.5A2.5 2.5 0 0 0 10.5 3H8.7l1.15-1.15a.5.5 0 0 0-.7-.7l-2 2a.5.5 0 0 0 0 .7zM14 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-8-9a2.5 2.5 0 0 1-2 2.45v4.55c0 .83.67 1.5 1.5 1.5h1.8l-1.15-1.15a.5.5 0 0 1 .7-.7l2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7-.7L7.29 13H5.5A2.5 2.5 0 0 1 3 10.5V5.95A2.5 2.5 0 1 1 6 3.5m-1 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
  </svg>
);

/** Fluent `branch_compare_16_filled`. */
export const FluentRefGitCompareFilledIcon = () => (
  <svg {...base}>
    <path d="M9.15 5.85a.5.5 0 1 0 .7-.7L8.71 4h1.79c.83 0 1.5.67 1.5 1.5v4.55a2.5 2.5 0 1 0 1 0V5.5A2.5 2.5 0 0 0 10.5 3H8.7l1.15-1.15a.5.5 0 0 0-.7-.7l-2 2a.5.5 0 0 0 0 .7zM6 3.5a2.5 2.5 0 0 1-2 2.45v4.55c0 .83.67 1.5 1.5 1.5h1.8l-1.15-1.15a.5.5 0 0 1 .7-.7l2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7-.7L7.29 13H5.5A2.5 2.5 0 0 1 3 10.5V5.95A2.5 2.5 0 1 1 6 3.5" />
  </svg>
);

/** Fluent `bluetooth_connected_20_regular`. */
export const FluentRefBluetoothConnectedIcon = () => (
  <svg {...base}>
    <path d="M9.3 2.04a.5.5 0 0 1 .55.1l4 4a.5.5 0 0 1-.02.74L10.26 10l3.57 3.12a.5.5 0 0 1 .02.73l-4 4A.5.5 0 0 1 9 17.5v-6.4l-3.17 2.78a.5.5 0 0 1-.66-.76L8.74 10 5.17 6.88a.5.5 0 0 1 .66-.76L9 8.9V2.5q.01-.32.3-.46m.7 9.06v5.2l2.77-2.78zm0-2.2 2.77-2.42L10 3.7zm7 1.1a1 1 0 1 1-2 0 1 1 0 0 1 2 0M3 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `bluetooth_connected_20_filled`. */
export const FluentRefBluetoothConnectedFilledIcon = () => (
  <svg {...base}>
    <path d="M10.28 2.22A.75.75 0 0 0 9 2.75v5.67L6.22 6.17a.75.75 0 1 0-.94 1.16L8.56 10l-3.28 2.67a.75.75 0 0 0 .94 1.16L9 11.58v5.67a.75.75 0 0 0 1.28.53l4-4a.75.75 0 0 0-.06-1.11L10.94 10l3.28-2.67a.75.75 0 0 0 .06-1.11zm.22 13.22v-3.86l2.13 1.73zm2.13-8.75L10.5 8.42V4.56zM4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0m13 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `data_bar_horizontal_20_regular`. */
export const FluentRefChartBarHorizontalIcon = () => (
  <svg {...base}>
    <path d="M2 4c0-1.1.9-2 2-2h5a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2m2-1a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2zm-2 7c0-1.1.9-2 2-2h8a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2m2-1a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm-2 7c0-1.1.9-2 2-2h12a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2m2-1a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2z" />
  </svg>
);

/** Fluent `data_bar_horizontal_20_filled`. */
export const FluentRefChartBarHorizontalFilledIcon = () => (
  <svg {...base}>
    <path d="M4 2a2 2 0 1 0 0 4h5a2 2 0 1 0 0-4zm0 6a2 2 0 1 0 0 4h8a2 2 0 1 0 0-4zm0 6a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4z" />
  </svg>
);

/** Fluent `person_square_16_regular`. */
export const FluentRefPersonSquareIcon = () => (
  <svg {...base}>
    <path d="M9.75 8h-3.5c-.69 0-1.29.57-1.17 1.25.19 1.08.82 2.25 2.92 2.25s2.73-1.17 2.92-2.25C11.04 8.57 10.44 8 9.75 8M8 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `person_square_16_filled`. */
export const FluentRefPersonSquareFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2m5.25 6h-3.5c-.69 0-1.29.57-1.17 1.25.19 1.08.82 2.25 2.92 2.25s2.73-1.17 2.92-2.25C11.04 8.57 10.44 8 9.75 8M8 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

/** Fluent `pen_16_regular`. */
export const FluentRefPenIcon = () => (
  <svg {...base}>
    <path d="M13.44 2.56a1.9 1.9 0 0 0-2.7 0l-7.4 7.4q-.27.27-.4.64l-.91 2.74a.5.5 0 0 0 .63.63l2.74-.91q.36-.12.65-.4L12 6.71l.26.26c.3.3.3.77 0 1.06l-1.11 1.12a.5.5 0 1 0 .7.7l1.12-1.11c.68-.69.68-1.8 0-2.48L12.71 6l.73-.73c.75-.75.75-1.96 0-2.7m-1.78 3.07-.03.03-6.3 6.3a1 1 0 0 1-.25.15l-1.79.6.6-1.8q.04-.14.16-.25l7.39-7.4a.91.91 0 1 1 1.3 1.3z" />
  </svg>
);

/** Fluent `pen_16_filled`. */
export const FluentRefPenFilledIcon = () => (
  <svg {...base}>
    <path d="M10.73 2.56a1.91 1.91 0 0 1 2.71 2.7l-.73.74.26.26c.68.69.68 1.8 0 2.48l-1.12 1.11a.5.5 0 0 1-.7-.7l1.11-1.12c.3-.3.3-.77 0-1.06L12 6.71l-5.95 5.95q-.28.28-.65.4l-2.74.91a.5.5 0 0 1-.63-.63l.91-2.74q.13-.36.4-.65z" />
  </svg>
);

/** Fluent `copy_16_regular`. */
export const FluentRefCopyCheckIcon = () => (
  <svg {...base}>
    <path d="M5 6H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1h1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM8 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `copy_16_filled`. */
export const FluentRefCopyCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M5 9a3 3 0 0 0 3 3h2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z" />
  </svg>
);

/** Fluent `document_dismiss_16_regular`. */
export const FluentRefDocumentDismissIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H8.66q.6-.42 1.08-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6.5 2h2.3L10 2.2v2.3c0 .28.22.5.5.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `document_dismiss_16_filled`. */
export const FluentRefDocumentDismissFilledIcon = () => (
  <svg {...base}>
    <path d="M9 4.5V1H5.5C4.67 1 4 1.67 4 2.5v2.7A5.5 5.5 0 0 1 8.66 15h3.84c.83 0 1.5-.67 1.5-1.5V6h-3.5A1.5 1.5 0 0 1 9 4.5m1 0V1.25L13.75 5H10.5a.5.5 0 0 1-.5-.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `calendar_cancel_16_regular`. */
export const FluentRefCalendarXIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m4.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.65-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7l-1.14-1.15z" />
  </svg>
);

/** Fluent `calendar_cancel_16_filled`. */
export const FluentRefCalendarXFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm2 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.65-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7l-1.14-1.15z" />
  </svg>
);

/** Fluent `folder_search_16_regular`. */
export const FluentRefFolderSearchIcon = () => (
  <svg {...base}>
    <path d="M3.5 2A2.5 2.5 0 0 0 1 4.5v7A2.5 2.5 0 0 0 3.5 14h4.17a5 5 0 0 1-.91-1H3.5A1.5 1.5 0 0 1 2 11.5V7h3.59c.4 0 .78-.16 1.06-.44L8.2 5h4.29c.83 0 1.5.67 1.5 1.5v1.17c.53.65.88 1.45.97 2.33H15V6.5A2.5 2.5 0 0 0 12.5 4H8.2L6.66 2.44A1.5 1.5 0 0 0 5.59 2zM2 6V4.5C2 3.67 2.67 3 3.5 3h2.09a.5.5 0 0 1 .35.15L7.29 4.5 5.94 5.85a.5.5 0 0 1-.35.15zm8.5 8c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L13.3 12.6a3.5 3.5 0 1 0-2.8 1.4m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `folder_search_16_filled`. */
export const FluentRefFolderSearchFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2A2.5 2.5 0 0 0 1 4.5V6h4.59a.5.5 0 0 0 .35-.15L8 3.8 6.65 2.44A1.5 1.5 0 0 0 5.59 2zM1 11.5V7h4.59c.4 0 .78-.16 1.06-.44L9.2 4h3.29A2.5 2.5 0 0 1 15 6.5V10h-.03a4.5 4.5 0 1 0-7.3 4H3.5A2.5 2.5 0 0 1 1 11.5m9.5 2.5c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L13.3 12.6a3.5 3.5 0 1 0-2.8 1.4m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `timer_off_20_regular`. */
export const FluentRefTimerOffIcon = () => (
  <svg {...base}>
    <path d="M4.96 5.67 2.15 2.85a.5.5 0 1 1 .7-.7l15 15a.5.5 0 0 1-.7.7l-2.32-2.31A6.98 6.98 0 0 1 2.5 11c0-2.13.96-4.05 2.46-5.33m9.16 9.16L10 10.7v.79a.5.5 0 0 1-1 0V9.7L5.67 6.39A5.99 5.99 0 0 0 9.5 17c1.86 0 3.52-.85 4.62-2.17M9 6.5v.38l1 1V6.5a.5.5 0 0 0-1 0m6.5 4.5a6 6 0 0 1-.35 2.03l.77.77q.57-1.3.58-2.8a7 7 0 0 0-9.8-6.42l.77.77A6 6 0 0 1 15.5 11m-8-9a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm7.66 1.93a.5.5 0 1 0-.71.7l1.41 1.42a.5.5 0 1 0 .71-.7z" />
  </svg>
);

/** Fluent `timer_off_20_filled`. */
export const FluentRefTimerOffFilledIcon = () => (
  <svg {...base}>
    <path d="M4.96 5.67 2.15 2.85a.5.5 0 1 1 .7-.7l15 15a.5.5 0 0 1-.7.7l-2.32-2.31A6.98 6.98 0 0 1 2.5 11c0-2.13.96-4.05 2.46-5.33M10 10.71l-1-1v1.79a.5.5 0 0 0 1 0zm0-4.21v1.38l5.92 5.92q.57-1.3.58-2.8a7 7 0 0 0-9.8-6.42L9 6.88V6.5a.5.5 0 0 1 1 0m-3-4c0-.28.22-.5.5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m7.45 1.43c.2-.2.51-.2.7 0l1.42 1.41a.5.5 0 1 1-.7.71l-1.42-1.41a.5.5 0 0 1 0-.71" />
  </svg>
);

/** Fluent `call_prohibited_16_regular`. */
export const FluentRefCallOffIcon = () => (
  <svg {...base}>
    <path d="m9.2 4.15.22.97a2 2 0 0 0 1.63 1.54l.7.12a1.9 1.9 0 0 0 2.16-1.46c.32-1.36-.18-2.9-1.6-3.5a11.51 11.51 0 0 0-8.59 0c-1.43.6-1.94 2.14-1.62 3.51a1.9 1.9 0 0 0 2.16 1.45l.7-.12A2 2 0 0 0 6.6 5.12l.21-.97A6 6 0 0 1 8 4a5 5 0 0 1 1.2.15m2.73-1.4c.85.35 1.25 1.32 1.01 2.35a.9.9 0 0 1-1.03.69l-.7-.12a1 1 0 0 1-.81-.77l-.28-1.26a.5.5 0 0 0-.33-.36h-.02l-.03-.02-.5-.12a6 6 0 0 0-2.97.12l-.03.01h-.01a.5.5 0 0 0-.34.37L5.61 4.9a1 1 0 0 1-.81.77l-.7.12a.9.9 0 0 1-1.03-.69c-.24-1.02.17-2 1.02-2.34a10.5 10.5 0 0 1 7.84 0M8 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-1a3 3 0 0 0 2.45-4.74l-4.19 4.19q.76.53 1.74.55m-2.45-1.26 4.19-4.19a3 3 0 0 0-4.18 4.18" />
  </svg>
);

/** Fluent `call_prohibited_16_filled`. */
export const FluentRefCallOffFilledIcon = () => (
  <svg {...base}>
    <path d="m9.76 5.43-.3-1.51A10 10 0 0 0 8 3.75a7 7 0 0 0-1.45.17l-.3 1.51a1.5 1.5 0 0 1-1.2 1.18l-.68.13a2 2 0 0 1-2.3-1.52L2 4.92c-.26-1.12.16-2.39 1.32-2.91a11.5 11.5 0 0 1 9.4 0c1.14.52 1.55 1.78 1.29 2.9l-.07.3a2 2 0 0 1-2.3 1.53l-.68-.13a1.5 1.5 0 0 1-1.2-1.18M8 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-1a3 3 0 0 0 2.45-4.74l-4.19 4.19q.76.53 1.74.55m-2.45-1.26 4.19-4.19a3 3 0 0 0-4.18 4.18" />
  </svg>
);

/** Fluent `sparkle_off_16_regular`. */
export const FluentRefSparkleOffIcon = () => (
  <svg {...base}>
    <path d="M14.15 1.15a.5.5 0 1 1 .7.7l-13 13a.5.5 0 0 1-.7-.7zM11.1 8a.8.8 0 0 1 .64.53l.25.78a1.1 1.1 0 0 0 .68.68l.77.24a.8.8 0 0 1 .02 1.52l-.77.26a1 1 0 0 0-.68.68l-.25.76A.8.8 0 0 1 11 14a.8.8 0 0 1-.76-.54L10 12.7a1 1 0 0 0-.68-.68l-.76-.25a.8.8 0 0 1-.02-1.52l.78-.25a1 1 0 0 0 .66-.68l.25-.77A.8.8 0 0 1 11.1 8m-.17 1.62a2.1 2.1 0 0 1-1.3 1.31l-.19.07.18.06a2 2 0 0 1 1.32 1.32l.06.18.06-.18a2 2 0 0 1 1.31-1.32l.19-.06-.2-.06a2 2 0 0 1-1.32-1.32l-.06-.18zM5.98 2q.3 0 .53.17.25.16.34.44L7.2 3.7a1.7 1.7 0 0 0 1.08 1.08l.62.2-.79.78-.14-.04a2.7 2.7 0 0 1-1.72-1.71l-.28-.87-.26.86A2.8 2.8 0 0 1 4 5.72L3.16 6l.86.26A2.7 2.7 0 0 1 5.73 8l.04.12-.8.8-.2-.6A1.7 1.7 0 0 0 3.7 7.2l-1.07-.34a.92.92 0 0 1-.01-1.74l1.08-.35a1.7 1.7 0 0 0 1.05-1.06l.35-1.1A.9.9 0 0 1 5.98 2" />
  </svg>
);

/** Fluent `sparkle_off_16_filled`. */
export const FluentRefSparkleOffFilledIcon = () => (
  <svg {...base}>
    <path d="M14.15 1.15a.5.5 0 1 1 .7.7l-13 13a.5.5 0 0 1-.7-.7zM11.1 8a.8.8 0 0 1 .64.53l.25.78a1.1 1.1 0 0 0 .68.68l.77.24a.8.8 0 0 1 .02 1.52l-.77.26a1 1 0 0 0-.68.68l-.25.76A.8.8 0 0 1 11 14a.8.8 0 0 1-.76-.54L10 12.7a1 1 0 0 0-.68-.68l-.76-.25a.8.8 0 0 1-.02-1.52l.78-.25a1 1 0 0 0 .66-.68l.25-.77A.8.8 0 0 1 11.1 8M5.98 2q.3 0 .53.17.25.16.34.44L7.2 3.7a1.7 1.7 0 0 0 1.08 1.08l.62.2L4.97 8.9l-.2-.6A1.7 1.7 0 0 0 3.7 7.22l-1.07-.35a.92.92 0 0 1-.01-1.74l1.08-.35a1.7 1.7 0 0 0 1.05-1.06l.35-1.1A.9.9 0 0 1 5.98 2" />
  </svg>
);

/** Fluent `person_lock_16_regular`. */
export const FluentRefPersonLockIcon = () => (
  <svg {...base}>
    <path d="M7 14v-1c-2.57 0-4-1.56-4-3v-.5c0-.28.22-.5.5-.5h3.72c.26-.48.72-.85 1.28-.96V8h-5C2.67 8 2 8.67 2 9.5v.5c0 1.97 1.86 4 5 4m2.75-9.75a2.75 2.75 0 1 0-5.5 0 2.75 2.75 0 0 0 5.5 0m-4.5 0a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0M9.5 8v1h-.62c-.49 0-.88.4-.88.9v4.2c0 .5.4.9.88.9h5.24c.49 0 .88-.4.88-.9V9.9c0-.5-.4-.9-.87-.9h-.63V8a2 2 0 1 0-4 0m2-1a1 1 0 0 1 1 1v1h-2V8a1 1 0 0 1 1-1m0 5.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5" />
  </svg>
);

/** Fluent `person_lock_16_filled`. */
export const FluentRefPersonLockFilledIcon = () => (
  <svg {...base}>
    <path d="M9.5 8v1h-.62c-.49 0-.88.4-.88.9v4.2c0 .5.4.9.88.9h5.24c.49 0 .88-.4.88-.9V9.9c0-.5-.4-.9-.87-.9h-.63V8a2 2 0 1 0-4 0m2-1a1 1 0 0 1 1 1v1h-2V8a1 1 0 0 1 1-1m0 5.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M7 14V9.9c0-.9.63-1.68 1.5-1.86V8h-5C2.67 8 2 8.67 2 9.5v.5c0 1.97 1.86 4 5 4m2.75-9.75a2.75 2.75 0 1 0-5.5 0 2.75 2.75 0 0 0 5.5 0" />
  </svg>
);

/** Fluent `shield_lock_16_regular`. */
export const FluentRefShieldLockIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v.9q-.46-.26-1-.36v-.06a6.6 6.6 0 0 1-4-1.8 6.7 6.7 0 0 1-4 1.8V7.5q.02 2.14 1.02 3.45A5.5 5.5 0 0 0 7 12.55v1.1A6.2 6.2 0 0 1 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M9.5 8v1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.5V8a2 2 0 1 0-4 0m1 1V8a1 1 0 1 1 2 0v1zm1 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `shield_lock_16_filled`. */
export const FluentRefShieldLockFilledIcon = () => (
  <svg {...base}>
    <path d="M8.35 2.15a.5.5 0 0 0-.7 0A5.7 5.7 0 0 1 3.5 4a.5.5 0 0 0-.5.5v3c0 2.92 1.35 5 4 6.15V10a2 2 0 0 1 1.5-1.94V8A3 3 0 0 1 13 5.4v-.9a.5.5 0 0 0-.5-.5q-2.28 0-4.15-1.85M9.5 9V8a2 2 0 1 1 4 0v1h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm1-1v1h2V8a1 1 0 1 0-2 0m1.75 4a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `battery_10_16_regular`. */
export const FluentRefBatteryFullIcon = () => (
  <svg {...base}>
    <path d="M4 6h7.5v4H4zm9.5.5h.5c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h7.5a2 2 0 0 1 2 2zm-2 4.5a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
  </svg>
);

/** Fluent `battery_10_16_filled`. */
export const FluentRefBatteryFullFilledIcon = () => (
  <svg {...base}>
    <path d="M14 6.5h-.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h7.5a2 2 0 0 0 2-2v-.5h.5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5M12 10a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V6c0-.28.23-.5.5-.5h7.5c.28 0 .5.22.5.5z" />
  </svg>
);

/** Fluent `battery_5_20_regular`. */
export const FluentRefBatteryMediumIcon = () => (
  <svg {...base}>
    <path d="M16 5a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1 3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM3 6a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h13a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm5.5 1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
  </svg>
);

/** Fluent `battery_5_20_filled`. */
export const FluentRefBatteryMediumFilledIcon = () => (
  <svg {...base}>
    <path d="M16 5a3 3 0 0 1 3 3 1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v.15A3 3 0 0 1 16 15H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM3 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `full_screen_minimize_16_regular`. */
export const FluentRefMinimizeIcon = () => (
  <svg {...base}>
    <path d="M11 4a1 1 0 0 0 1 1h1.5a.5.5 0 0 1 0 1H12a2 2 0 0 1-2-2V2.5a.5.5 0 0 1 1 0zm0 8a1 1 0 0 1 1-1h1.5a.5.5 0 0 0 0-1H12a2 2 0 0 0-2 2v1.5a.5.5 0 0 0 1 0zm-7-1a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 1 0V12a2 2 0 0 0-2-2H2.5a.5.5 0 0 0 0 1zm1-7a1 1 0 0 1-1 1H2.5a.5.5 0 0 0 0 1H4a2 2 0 0 0 2-2V2.5a.5.5 0 0 0-1 0z" />
  </svg>
);

/** Fluent `full_screen_minimize_16_filled`. */
export const FluentRefMinimizeFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 4c0 .28.22.5.5.5h1.75a.75.75 0 0 1 0 1.5H12a2 2 0 0 1-2-2V2.25a.75.75 0 0 1 1.5 0zm0 8c0-.28.22-.5.5-.5h1.75a.75.75 0 0 0 0-1.5H12a2 2 0 0 0-2 2v1.75a.75.75 0 0 0 1.5 0zM4 11.5c.28 0 .5.22.5.5v1.75a.75.75 0 0 0 1.5 0V12a2 2 0 0 0-2-2H2.25a.75.75 0 0 0 0 1.5zM4.5 4a.5.5 0 0 1-.5.5H2.25a.75.75 0 0 0 0 1.5H4a2 2 0 0 0 2-2V2.25a.75.75 0 0 0-1.5 0z" />
  </svg>
);

/** Fluent `spinner_ios_16_regular`. */
export const FluentRefLoaderCircleIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 6 6 .5.5 0 0 0 0 1 7 7 0 1 0-7-7 .5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `spinner_ios_16_filled`. */
export const FluentRefLoaderCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 8A5.5 5.5 0 1 1 8 13.5.75.75 0 0 0 8 15a7 7 0 1 0-7-7 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `text_align_justify_20_regular`. */
export const FluentRefTextAlignJustifyIcon = () => (
  <svg {...base}>
    <path d="M2 4.5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m0 5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m.5 4.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_align_justify_20_filled`. */
export const FluentRefTextAlignJustifyFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.25c0-.41.34-.75.75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25m0 5c0-.41.34-.75.75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25m.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `text_case_lowercase_16_regular`. */
export const FluentRefCaseLowerIcon = () => (
  <svg {...base}>
    <path d="M9.5 2.5c.28 0 .5.22.5.5v4.6q.64-.58 1.5-.6c1.38 0 2.5 1.34 2.5 3s-1.12 3-2.5 3q-.86-.02-1.5-.6v.1a.5.5 0 0 1-1 0V3c0-.28.22-.5.5-.5m2 9.5c.67 0 1.5-.72 1.5-2s-.83-2-1.5-2-1.5.72-1.5 2 .83 2 1.5 2M7 8.7v3.81a.5.5 0 0 1-.43.49H6.5a.5.5 0 0 1-.5-.43v-.14Q5 13 4.17 13A2.1 2.1 0 0 1 2 10.83c0-1.15.8-2 2.1-2.16a5 5 0 0 1 1.9.14c0-.74-.37-1.1-1.2-1.14q-.94-.05-1.35.24a.5.5 0 0 1-.57-.82q.65-.45 1.79-.43h.19c1.3.07 2.08.83 2.14 2.04M5.8 9.82a4 4 0 0 0-1.57-.13c-.82.1-1.23.53-1.23 1.17 0 .73.47 1.16 1.17 1.16a3 3 0 0 0 1.66-.64l.17-.11v-1.4z" />
  </svg>
);

/** Fluent `text_case_lowercase_16_filled`. */
export const FluentRefCaseLowerFilledIcon = () => (
  <svg {...base}>
    <path d="M9.75 2.25c.41 0 .75.34.75.75v4.3Q11 7 11.6 7c1.44 0 2.6 1.4 2.6 3.13 0 1.72-1.16 3.12-2.6 3.12q-.66 0-1.21-.36A.75.75 0 0 1 9 12.5V3c0-.41.34-.75.75-.75m1.85 9.5c.37 0 1.1-.46 1.1-1.62s-.73-1.63-1.1-1.63c-.36 0-1.1.46-1.1 1.63 0 1.16.74 1.62 1.1 1.62M7.13 8.87v3.8c-.04.09-.13.26-.2.32a.6.6 0 0 1-.35.17H6.5a.6.6 0 0 1-.61-.49q-.9.5-1.72.5c-1.3 0-2.3-.92-2.3-2.3q0-.91.6-1.54.6-.61 1.62-.74a5 5 0 0 1 1.78.1 1 1 0 0 0-.25-.58q-.23-.25-.82-.28-.94-.03-1.28.22a.63.63 0 0 1-.71-1.02 3 3 0 0 1 1.86-.45h.2q1.01.06 1.61.62.6.58.64 1.53zM3.39 10.2a1 1 0 0 0-.27.7q0 .51.3.77.26.26.75.27.62 0 1.6-.62l.1-.08v-1.23l-.1-.03a4 4 0 0 0-1.53-.13q-.59.09-.85.35" />
  </svg>
);

/** Fluent `text_header_1_20_regular`. */
export const FluentRefHeading1Icon = () => (
  <svg {...base}>
    <path d="M16.55 4a.5.5 0 0 1 .45.5v11a.5.5 0 0 1-1 0V6.73a9 9 0 0 1-2.22 2.19.5.5 0 1 1-.56-.84 6.8 6.8 0 0 0 2.83-3.8.5.5 0 0 1 .5-.28M2.5 4c.28 0 .5.22.5.5V9h6V4.5a.5.5 0 1 1 1 0v11a.5.5 0 0 1-1 0V10H3v5.5a.5.5 0 0 1-1 0v-11c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_header_1_20_filled`. */
export const FluentRefHeading1FilledIcon = () => (
  <svg {...base}>
    <path d="M9.25 4c.41 0 .75.34.75.75v10.5a.75.75 0 0 1-1.5 0V10.5h-5v4.75a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0V9h5V4.75c0-.41.34-.75.75-.75m7.11 0c.37.06.64.38.64.75v10.5a.75.75 0 0 1-1.5 0V7.46a10 10 0 0 1-1.81 1.65l-.07.04a.75.75 0 0 1-.8-1.27l.4-.28a8 8 0 0 0 2.3-3.01l.01-.06c.11-.35.46-.58.83-.52" />
  </svg>
);

/** Fluent `text_header_1_20_regular`. */
export const FluentRefHeading2Icon = () => (
  <svg {...base}>
    <path d="M16.55 4a.5.5 0 0 1 .45.5v11a.5.5 0 0 1-1 0V6.73a9 9 0 0 1-2.22 2.19.5.5 0 1 1-.56-.84 6.8 6.8 0 0 0 2.83-3.8.5.5 0 0 1 .5-.28M2.5 4c.28 0 .5.22.5.5V9h6V4.5a.5.5 0 1 1 1 0v11a.5.5 0 0 1-1 0V10H3v5.5a.5.5 0 0 1-1 0v-11c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_header_1_20_filled`. */
export const FluentRefHeading2FilledIcon = () => (
  <svg {...base}>
    <path d="M9.25 4c.41 0 .75.34.75.75v10.5a.75.75 0 0 1-1.5 0V10.5h-5v4.75a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0V9h5V4.75c0-.41.34-.75.75-.75m7.11 0c.37.06.64.38.64.75v10.5a.75.75 0 0 1-1.5 0V7.46a10 10 0 0 1-1.81 1.65l-.07.04a.75.75 0 0 1-.8-1.27l.4-.28a8 8 0 0 0 2.3-3.01l.01-.06c.11-.35.46-.58.83-.52" />
  </svg>
);

/** Fluent `text_header_1_20_regular`. */
export const FluentRefHeading3Icon = () => (
  <svg {...base}>
    <path d="M16.55 4a.5.5 0 0 1 .45.5v11a.5.5 0 0 1-1 0V6.73a9 9 0 0 1-2.22 2.19.5.5 0 1 1-.56-.84 6.8 6.8 0 0 0 2.83-3.8.5.5 0 0 1 .5-.28M2.5 4c.28 0 .5.22.5.5V9h6V4.5a.5.5 0 1 1 1 0v11a.5.5 0 0 1-1 0V10H3v5.5a.5.5 0 0 1-1 0v-11c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_header_1_20_filled`. */
export const FluentRefHeading3FilledIcon = () => (
  <svg {...base}>
    <path d="M9.25 4c.41 0 .75.34.75.75v10.5a.75.75 0 0 1-1.5 0V10.5h-5v4.75a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0V9h5V4.75c0-.41.34-.75.75-.75m7.11 0c.37.06.64.38.64.75v10.5a.75.75 0 0 1-1.5 0V7.46a10 10 0 0 1-1.81 1.65l-.07.04a.75.75 0 0 1-.8-1.27l.4-.28a8 8 0 0 0 2.3-3.01l.01-.06c.11-.35.46-.58.83-.52" />
  </svg>
);

/** Fluent `position_to_back_20_regular`. */
export const FluentRefSendToBackIcon = () => (
  <svg {...base}>
    <path d="M12 14c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 9v3.5A2.5 2.5 0 0 0 7.5 15H11v-1H9.7l1.67-1.66q.36-.61.97-.97L14 9.7V11h1V7.5A2.5 2.5 0 0 0 12.5 5H9v1h1.3L8.62 7.66q-.36.61-.97.97L6 10.3V9zm6.7-3h.8q.35 0 .65.15l-7 7A2 2 0 0 1 6 12.5v-.8zm-4.2 8a2 2 0 0 1-.65-.15l7-7q.15.3.15.65v.8L8.3 14zM1 3c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `position_to_back_20_filled`. */
export const FluentRefSendToBackFilledIcon = () => (
  <svg {...base}>
    <path d="M12 14c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 9h1.3C7.8 9 9 7.8 9 6.3V5h3.5A2.5 2.5 0 0 1 15 7.5V11h-1.3a2.7 2.7 0 0 0-2.7 2.7V15H7.5A2.5 2.5 0 0 1 5 12.5zM1 3c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `arrow_export_up_16_regular`. */
export const FluentRefArrowUpFromLineIcon = () => (
  <svg {...base}>
    <path d="M3 14.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m1.15-9.15a.5.5 0 0 1 0-.7l3.5-3.5c.2-.2.5-.2.7 0l3.5 3.5a.5.5 0 0 1-.7.7L8.5 2.71v8.79a.5.5 0 0 1-1 0V2.7L4.85 5.36a.5.5 0 0 1-.7 0" />
  </svg>
);

/** Fluent `arrow_export_up_16_filled`. */
export const FluentRefArrowUpFromLineFilledIcon = () => (
  <svg {...base}>
    <path d="M3 14.25c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75m.97-9.53a.75.75 0 1 0 1.06 1.06l2.22-2.22v7.69a.75.75 0 0 0 1.5 0V3.56l2.22 2.22a.75.75 0 1 0 1.06-1.06l-3.5-3.5a.75.75 0 0 0-1.06 0z" />
  </svg>
);

/** Fluent `arrow_maximize_16_regular`. */
export const FluentRefMaximizeIcon = () => (
  <svg {...base}>
    <path d="M12.4 3c.33 0 .6.27.6.6v4.9a.5.5 0 0 1-1 0V4.7L4.7 12h3.8a.5.5 0 0 1 0 1H3.6a.6.6 0 0 1-.6-.6V7.5a.5.5 0 0 1 1 0v3.8L11.3 4H7.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `arrow_maximize_16_filled`. */
export const FluentRefMaximizeFilledIcon = () => (
  <svg {...base}>
    <path d="M12.75 2.5c.41 0 .75.34.75.75v5a.75.75 0 0 1-1.5 0V5.06L5.06 12h3.19a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75v-5a.75.75 0 0 1 1.5 0v3.19L10.94 4H7.75a.75.75 0 0 1 0-1.5z" />
  </svg>
);

/** Fluent `text_whole_word_16_regular`. */
export const FluentRefWholeWordIcon = () => (
  <svg {...base}>
    <path d="M10 2a.5.5 0 0 0-1 0v9.5a.5.5 0 0 0 1 0v-.1q.64.59 1.5.6c1.38 0 2.5-1.34 2.5-3s-1.12-3-2.5-3q-.86.02-1.5.6zm3 7c0 1.28-.84 2-1.5 2S10 10.28 10 9s.84-2 1.5-2 1.5.72 1.5 2M7 7.83V7.7c-.06-1.21-.83-1.97-2.14-2.03h-.2a3 3 0 0 0-1.78.42.5.5 0 1 0 .57.82q.4-.3 1.36-.24c.82.04 1.18.4 1.19 1.14a5 5 0 0 0-1.9-.14C2.8 7.83 2 8.68 2 9.83c0 1.3.94 2.17 2.17 2.17Q5 12 6 11.43v.14a.5.5 0 0 0 .5.43h.07a.5.5 0 0 0 .43-.5zm-2.77.86a4 4 0 0 1 1.57.13l.2.06v1.39l-.17.11q-.98.64-1.66.64c-.7 0-1.17-.43-1.17-1.16 0-.63.4-1.07 1.23-1.17M16 13.5V13a.5.5 0 1 0-1 0v.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V13a.5.5 0 1 0-1 0v.5A1.5 1.5 0 0 0 1.5 15h13a1.5 1.5 0 0 0 1.5-1.5" />
  </svg>
);

/** Fluent `text_whole_word_16_filled`. */
export const FluentRefWholeWordFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 5.75q-.67 0-1.25.35V2a.75.75 0 0 0-1.5 0v9.5a.75.75 0 0 0 1.42.34q.61.4 1.33.41c1.52 0 2.75-1.46 2.75-3.25 0-1.8-1.23-3.25-2.75-3.25m0 5c-.52 0-1.25-.6-1.25-1.75 0-1.14.73-1.75 1.25-1.75s1.25.6 1.25 1.75c0 1.14-.73 1.75-1.25 1.75M4.87 5.42h-.2a3.2 3.2 0 0 0-1.94.47.75.75 0 0 0-.18 1.04.75.75 0 0 0 1.04.19c.16-.11.5-.24 1.2-.2q.8.02.92.57-.83-.15-1.64-.07c-1.4.17-2.32 1.12-2.32 2.41 0 1.4 1.02 2.42 2.42 2.42q.77 0 1.65-.44c.12.26.38.44.7.44h.08a.75.75 0 0 0 .65-.74V7.69c-.07-1.35-.95-2.2-2.39-2.27m.85 3.64.03 1.08-.06.04c-1.45.95-2.44.66-2.44-.32q0-.8 1-.92.73-.09 1.47.12M1.5 15h13c.83 0 1.5-.67 1.5-1.5v-.75a.75.75 0 0 0-1.5 0v.75h-13v-.75a.75.75 0 0 0-1.5 0v.75c0 .83.67 1.5 1.5 1.5" />
  </svg>
);

/** Fluent `book_16_regular`. */
export const FluentRefRepositoryIcon = () => (
  <svg {...base}>
    <path d="M6 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm0 1h4v1H6zm5-3H5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h7.5a.5.5 0 0 0 0-1H5a1 1 0 0 1-1-1h8.5a.5.5 0 0 0 .5-.5V3a2 2 0 0 0-2-2M4 12V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9z" />
  </svg>
);

/** Fluent `book_16_filled`. */
export const FluentRefRepositoryFilledIcon = () => (
  <svg {...base}>
    <path d="M11 1H5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h7.5a.5.5 0 0 0 0-1H5a1 1 0 0 1-1-1h8.5a.5.5 0 0 0 .5-.5V3a2 2 0 0 0-2-2M5 3.5h6c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V4c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_regular`. */
export const FluentRefFolderTreeIcon = () => (
  <svg {...base}>
    <path d="M2 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m4.5 4a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_filled`. */
export const FluentRefFolderTreeFilledIcon = () => (
  <svg {...base}>
    <path d="M2.25 5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m0 4.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.75 3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M5.75 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8m4.25 3.5a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `folder_arrow_right_16_regular`. */
export const FluentRefFolderInputIcon = () => (
  <svg {...base}>
    <path d="M2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3H3.5C2.67 3 2 3.67 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v.76a6 6 0 0 0-1-.66v-.1c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7H2v4.5c0 .83.67 1.5 1.5 1.5h2.7q.16.52.4 1H3.5A2.5 2.5 0 0 1 1 11.5zM11.5 7a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m2.35 4.85a.5.5 0 0 0 .15-.35.5.5 0 0 0-.15-.35l-2-2a.5.5 0 0 0-.7.7L12.29 11H9.5a.5.5 0 0 0 0 1h2.8l-1.15 1.15a.5.5 0 0 0 .7.7z" />
  </svg>
);

/** Fluent `folder_arrow_right_16_filled`. */
export const FluentRefFolderInputFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1zM1 7v4.5A2.5 2.5 0 0 0 3.5 14h3.1q-.58-1.14-.6-2.5a5.5 5.5 0 0 1 9-4.24V6.5A2.5 2.5 0 0 0 12.5 4H9.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7zm10.5 0a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m2.35 4.85a.5.5 0 0 0 .15-.35.5.5 0 0 0-.15-.35l-2-2a.5.5 0 0 0-.7.7L12.29 11H9.5a.5.5 0 0 0 0 1h2.8l-1.15 1.15a.5.5 0 0 0 .7.7z" />
  </svg>
);

/** Fluent `braces_16_regular`. */
export const FluentRefFileJsonIcon = () => (
  <svg {...base}>
    <path d="M5 2a2 2 0 0 0-2 2v2c0 .53 0 .8-.09 1-.06.16-.2.33-.63.55a.5.5 0 0 0 0 .9c.44.22.57.4.63.55.08.2.09.47.09 1v2c0 1.1.9 2 2 2a.5.5 0 0 0 0-1 1 1 0 0 1-1-1V9.94c0-.45 0-.91-.16-1.31Q3.69 8.26 3.4 8q.3-.26.44-.63c.16-.4.16-.86.16-1.3V4a1 1 0 0 1 1-1 .5.5 0 0 0 0-1m6 0a2 2 0 0 1 2 2v2c0 .53 0 .8.09 1 .06.16.2.33.63.55a.5.5 0 0 1 0 .9c-.44.22-.57.4-.63.55-.08.2-.09.47-.09 1v2a2 2 0 0 1-2 2 .5.5 0 0 1 0-1 1 1 0 0 0 1-1V9.94c0-.45 0-.91.16-1.31q.14-.37.44-.63-.3-.26-.44-.63c-.16-.4-.16-.86-.16-1.3V4a1 1 0 0 0-1-1 .5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `braces_16_filled`. */
export const FluentRefFileJsonFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 2C3.51 2 2.5 3 2.5 4.25V6c0 .55-.01.76-.07.9-.03.09-.1.22-.52.43a.75.75 0 0 0 0 1.34c.41.2.49.34.52.42.06.15.07.36.07.91v1.75c0 1.24 1 2.25 2.25 2.25a.75.75 0 0 0 0-1.5.75.75 0 0 1-.75-.75V9.93c0-.44 0-.95-.18-1.4A2 2 0 0 0 3.5 8q.2-.23.32-.53C4 7.02 4 6.5 4 6.07V4.26c0-.41.34-.75.75-.75a.75.75 0 0 0 0-1.5m6.5 0c1.24 0 2.25 1 2.25 2.25V6c0 .55.01.76.07.9.03.09.1.22.52.43a.75.75 0 0 1 0 1.34c-.41.2-.49.34-.52.42-.06.15-.07.36-.07.91v1.75c0 1.24-1 2.25-2.25 2.25a.75.75 0 0 1 0-1.5c.41 0 .75-.34.75-.75V9.93c0-.44 0-.95.18-1.4q.12-.3.32-.53a2 2 0 0 1-.32-.53 4 4 0 0 1-.18-1.4V4.26a.75.75 0 0 0-.75-.75.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `document_error_16_regular`. */
export const FluentRefFileWarningIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.2q.49-.13 1-.18V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1H9.74q-.46.57-1.07 1H12a2 2 0 0 0 2-2V5.42q-.01-.62-.44-1.06l-2.92-2.92A1.5 1.5 0 0 0 9.58 1zm4 3.5V2.21l2.8 2.8h-2.3a.5.5 0 0 1-.5-.5m0 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M5.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5m0 5.13a.62.62 0 1 0 0-1.25.62.62 0 0 0 0 1.24" />
  </svg>
);

/** Fluent `document_error_16_filled`. */
export const FluentRefFileWarningFilledIcon = () => (
  <svg {...base}>
    <path d="M6 1h3v3.5c0 .83.67 1.5 1.5 1.5H14v7a2 2 0 0 1-2 2H8.67A5.5 5.5 0 0 0 4 5.2V3c0-1.1.9-2 2-2m4.5 4H14l-4-4v3.5c0 .28.22.5.5.5m-.5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M5.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 1 0 1 0v-2a.5.5 0 0 0-.5-.5m0 5.12a.62.62 0 1 0 0-1.25.62.62 0 0 0 0 1.25" />
  </svg>
);

/** Fluent `text_bullet_list_square_16_regular`. */
export const FluentRefLogsIcon = () => (
  <svg {...base}>
    <path d="M5.5 5A.75.75 0 1 1 4 5a.75.75 0 0 1 1.5 0m0 3A.75.75 0 1 1 4 8a.75.75 0 0 1 1.5 0m-.75 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6.5 5c0-.28.22-.5.5-.5h4.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5M7 7.5a.5.5 0 0 0 0 1h4.5a.5.5 0 0 0 0-1zM6.5 11c0-.28.22-.5.5-.5h4.5a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5m-2-9A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `text_bullet_list_square_16_filled`. */
export const FluentRefLogsFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm3.5.5A.75.75 0 1 0 4 5a.75.75 0 0 0 1.5 0m0 3A.75.75 0 1 0 4 8a.75.75 0 0 0 1.5 0m-.75 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6.5 5c0 .28.22.5.5.5h4.5a.5.5 0 0 0 0-1H7a.5.5 0 0 0-.5.5M7 7.5a.5.5 0 0 0 0 1h4.5a.5.5 0 0 0 0-1zM6.5 11c0 .28.22.5.5.5h4.5a.5.5 0 0 0 0-1H7a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `pipeline_20_regular`. */
export const FluentRefPipelineIcon = () => (
  <svg {...base}>
    <path d="M2 5.5a1.5 1.5 0 1 1 3 0V6h10v-.5a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0V14H5v.5a1.5 1.5 0 0 1-3 0zm2 0a.5.5 0 0 0-1 0v9a.5.5 0 0 0 1 0zM15 7H5v6h10zm2-1.5a.5.5 0 0 0-1 0v9a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `pipeline_20_filled`. */
export const FluentRefPipelineFilledIcon = () => (
  <svg {...base}>
    <path d="M2 5.5a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0zm13 0v9a1.5 1.5 0 0 0 3 0v-9a1.5 1.5 0 0 0-3 0M14 14V6H6v8z" />
  </svg>
);

/** Fluent `database_search_20_regular`. */
export const FluentRefDatabaseSearchIcon = () => (
  <svg {...base}>
    <path d="M4 5c0-1 .88-1.76 1.9-2.22C6.98 2.28 8.43 2 10 2s3.02.29 4.1.78C15.12 3.24 16 3.99 16 5v4.76q-.46-.31-1-.5V6.7q-.41.3-.9.52c-1.08.5-2.53.78-4.1.78s-3.02-.29-4.1-.78A5 5 0 0 1 5 6.7V15c0 .37.36.88 1.32 1.31a9 9 0 0 0 4.33.67q.68.56 1.53.82-1.02.2-2.18.2c-1.57 0-3.02-.29-4.1-.78C4.88 16.76 4 16.01 4 15zm1 0c0 .37.36.88 1.32 1.31.91.42 2.22.69 3.68.69s2.77-.27 3.68-.69C14.64 5.88 15 5.37 15 5s-.36-.88-1.32-1.31A9 9 0 0 0 10 3c-1.46 0-2.77.27-3.68.69C5.36 4.12 5 4.63 5 5m8.5 12q1.2-.02 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L16.3 15.6q.68-.9.7-2.1a3.5 3.5 0 1 0-3.5 3.5m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `database_search_20_filled`. */
export const FluentRefDatabaseSearchFilledIcon = () => (
  <svg {...base}>
    <path d="M10 8c3.31 0 6-1.34 6-3s-2.69-3-6-3-6 1.34-6 3 2.69 3 6 3m4.69.02q.72-.36 1.31-.9v2.64a4.5 4.5 0 1 0-3.83 8.04q-1.02.2-2.17.2c-3.31 0-6-1.34-6-3V7.12q.59.54 1.31.9C6.56 8.64 8.22 9 10 9s3.44-.36 4.69-.98M13.5 17q1.2-.02 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L16.3 15.6q.68-.9.7-2.1a3.5 3.5 0 1 0-3.5 3.5m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `database_lightning_20_regular`. */
export const FluentRefDatabaseZapIcon = () => (
  <svg {...base}>
    <path d="M4 5c0-1 .88-1.76 1.9-2.22 1.3-.54 2.7-.8 4.1-.78 1.4-.03 2.8.24 4.1.78C15.13 3.24 16 3.99 16 5v4h-1V6.7q-.42.3-.9.52c-1.3.54-2.7.8-4.1.78-1.4.03-2.8-.24-4.1-.78A5 5 0 0 1 5 6.7V15c0 .37.36.87 1.32 1.31A9 9 0 0 0 10 17q.75.02 1.49-.09.23.09.51.09h.47l-.2.79Q11.16 18 10 18c-1.4.03-2.8-.24-4.1-.78C4.87 16.75 4 16.01 4 15zm1 0c0 .37.36.87 1.32 1.31A9 9 0 0 0 10 7a9 9 0 0 0 3.68-.69C14.64 5.87 15 5.37 15 5s-.36-.88-1.32-1.31A9 9 0 0 0 10 3a9 9 0 0 0-3.68.69C5.36 4.12 5 4.63 5 5m8.11 11c.33 0 .57.3.49.62l-.44 1.74c-.12.48.46.83.83.49l4.87-4.55a.75.75 0 0 0-.51-1.3h-.4a.5.5 0 0 1-.48-.66l.56-1.68a.5.5 0 0 0-.47-.66h-3.47a.5.5 0 0 0-.47.3l-2.08 5c-.14.34.1.7.46.7z" />
  </svg>
);

/** Fluent `database_lightning_20_filled`. */
export const FluentRefDatabaseZapFilledIcon = () => (
  <svg {...base}>
    <path d="M10 8c3.31 0 6-1.34 6-3s-2.69-3-6-3-6 1.34-6 3 2.69 3 6 3m4.69.02q.72-.36 1.31-.9V9h-1.92c-.6 0-1.15.36-1.38.92l-2.08 5A1.5 1.5 0 0 0 12 17h.47l-.2.78q-1.05.21-2.27.22c-3.31 0-6-1.34-6-3V7.12q.59.54 1.31.9C6.56 8.64 8.22 9 10 9s3.44-.36 4.69-.98M13.11 16c.33 0 .57.3.49.62l-.44 1.74c-.12.48.46.83.83.49l4.87-4.55a.75.75 0 0 0-.51-1.3h-.4a.5.5 0 0 1-.48-.66l.56-1.68a.5.5 0 0 0-.47-.66h-3.47a.5.5 0 0 0-.47.3l-2.08 5c-.14.34.1.7.46.7z" />
  </svg>
);

/** Fluent `cloud_sync_16_regular`. */
export const FluentRefCloudSyncIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.77q.05.51.19 1h-.96a3.25 3.25 0 0 1-.22-6.5 4 4 0 0 1 7.89-.32q-.52-.14-1.09-.17A3 3 0 0 0 8 3m2.5 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M13 8v1.5a.5.5 0 0 1-.5.5H11a.5.5 0 0 1 0-1h.47a2 2 0 0 0-2.57.55.5.5 0 0 1-.8-.6 3 3 0 0 1 3.9-.8V8a.5.5 0 0 1 1 0m-4.5 5.5A.5.5 0 0 1 8 13v-1.5c0-.28.22-.5.5-.5H10a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 2.57-.55.5.5 0 1 1 .8.6 3 3 0 0 1-3.9.8V13a.5.5 0 0 1-.5.5" />
  </svg>
);

/** Fluent `cloud_sync_16_filled`. */
export const FluentRefCloudSyncFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.89-.32A5.5 5.5 0 0 0 5.2 12h-.96a3.25 3.25 0 0 1-.22-6.5M10.5 15a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M13 8v1.5a.5.5 0 0 1-.5.5H11a.5.5 0 0 1 0-1h.47a2 2 0 0 0-2.57.55.5.5 0 0 1-.8-.6 3 3 0 0 1 3.9-.8V8a.5.5 0 0 1 1 0m-4.5 5.5A.5.5 0 0 1 8 13v-1.5c0-.28.22-.5.5-.5H10a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 2.57-.55.5.5 0 1 1 .8.6 3 3 0 0 1-3.9.8V13a.5.5 0 0 1-.5.5" />
  </svg>
);

/** Fluent `plug_connected_16_regular`. */
export const FluentRefApiIcon = () => (
  <svg {...base}>
    <path d="M6.01 6.78a1.25 1.25 0 0 0-1.76 0L4.03 7a3.5 3.5 0 0 0-.32 4.58l-2.06 2.07a.5.5 0 0 0 .7.7l2.08-2.07q.92.66 2.03.66c.94 0 1.89-.37 2.6-1.08l.14-.14c.48-.48.48-1.28 0-1.76zm2.48 4.24-.13.13c-1 1-2.6 1.06-3.57.14a2.5 2.5 0 0 1-.06-3.59l.22-.22a.3.3 0 0 1 .18-.07q.1 0 .18.07l3.18 3.18c.1.1.1.26 0 .36m5.86-9.37a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7M11.27 8.3l-.22.22c-.1.1-.26.1-.36 0L7.51 5.34a.25.25 0 0 1 0-.36l.13-.13a2.7 2.7 0 0 1 1.9-.79c.61 0 1.21.21 1.67.65a2.5 2.5 0 0 1 .06 3.59" />
  </svg>
);

/** Fluent `plug_connected_16_filled`. */
export const FluentRefApiFilledIcon = () => (
  <svg {...base}>
    <path d="M6.01 6.78a1.25 1.25 0 0 0-1.76 0L4.03 7a3.5 3.5 0 0 0-.32 4.58l-2.06 2.07a.5.5 0 0 0 .7.7l2.08-2.07q.92.66 2.03.66c.94 0 1.89-.37 2.6-1.08l.14-.14c.48-.48.48-1.28 0-1.76zm8.34-5.13a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `ram_16_regular`. */
export const FluentRefMemoryIcon = () => (
  <svg {...base}>
    <path d="M3.5 5h9c.28 0 .5.22.5.5v3a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-3c0-.28.22-.5.5-.5M9 8V6H7v2zM6 6H4v2h2zm4 2h2V6h-2zM3 3h10a2 2 0 0 1 2 2v4a2 2 0 0 1-1 1.73v1.02c0 .69-.56 1.25-1.25 1.25H9.5a.5.5 0 0 1-.35-.15L8 11.71l-1.15 1.14a.5.5 0 0 1-.35.15H3.25C2.56 13 2 12.44 2 11.75v-1.02A2 2 0 0 1 1 9V5c0-1.1.9-2 2-2m.25 9h3.04l1-1H3v.75c0 .14.11.25.25.25m9.5 0q.23-.02.25-.25V11H8.7l1 1zm.25-2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
  </svg>
);

/** Fluent `ram_16_filled`. */
export const FluentRefMemoryFilledIcon = () => (
  <svg {...base}>
    <path d="M10 8h2V6h-2zM7 8h2V6H7zM4 8h2V6H4zm9-5H3a2 2 0 0 0-2 2v4a2 2 0 0 0 1 1.73v1.02c0 .69.56 1.25 1.25 1.25H6.5a.5.5 0 0 0 .35-.15L8 11.71l1.15 1.14q.14.15.35.15h3.25c.69 0 1.25-.56 1.25-1.25v-1.02A2 2 0 0 0 15 9V5a2 2 0 0 0-2-2m0 5.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-3c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5z" />
  </svg>
);

/** Fluent `brain_circuit_20_regular`. */
export const FluentRefBrainCircuitIcon = () => (
  <svg {...base}>
    <path d="M5.7 3.95a2.42 2.42 0 0 1 4.3-1 2.42 2.42 0 0 1 4.3 1l.12.63.41.08A2.7 2.7 0 0 1 17 7.3v.2a2.5 2.5 0 0 1-.8 1.84 3.25 3.25 0 0 1-.77 6.08l-.04.19A2.97 2.97 0 0 1 10 16.68a2.97 2.97 0 0 1-5.39-1.07l-.03-.19a3.25 3.25 0 0 1-.78-6.08A2.5 2.5 0 0 1 3 7.5v-.2c0-1.28.9-2.4 2.17-2.64l.4-.08zM14 10.9v.59c0 .83-.67 1.5-1.5 1.5h-2v2.03a1.97 1.97 0 0 0 3.9.38l.11-.5a.5.5 0 0 1 .4-.4l.28-.06a2.25 2.25 0 0 0-.28-4.44 1.5 1.5 0 0 1-.91.9m-1 0a1.5 1.5 0 1 1 1.9-1.96A1.5 1.5 0 0 0 16 7.5v-.2c0-.8-.57-1.5-1.37-1.66l-.73-.15a.5.5 0 0 1-.39-.4l-.2-.95a1.42 1.42 0 0 0-2.81.28V12h2a.5.5 0 0 0 .5-.5zM9.5 6V4.42a1.42 1.42 0 0 0-2.82-.28l-.19.96a.5.5 0 0 1-.4.39l-.72.15A1.7 1.7 0 0 0 4 7.3v.2C4 8.33 4.67 9 5.5 9h1c.83 0 1.5.67 1.5 1.5v.59a1.5 1.5 0 1 1-1 0v-.59a.5.5 0 0 0-.5-.5H5.25a2.25 2.25 0 0 0-.44 4.45l.29.06c.2.04.35.2.39.4l.1.5a1.97 1.97 0 0 0 3.91-.38V7h-.59a1.5 1.5 0 1 1 0-1zM8 6.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M7.5 13a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m6-3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
  </svg>
);

/** Fluent `brain_circuit_20_filled`. */
export const FluentRefBrainCircuitFilledIcon = () => (
  <svg {...base}>
    <path d="M8.08 2q.8.01 1.42.46V6h-.59a1.5 1.5 0 1 0 0 1h.59v10.23a3 3 0 0 1-4.97-1.82A3.24 3.24 0 0 1 2.9 10h2.6c.28 0 .5.22.5.5v.59a1.5 1.5 0 1 0 1 0v-.59C7 9.67 6.33 9 5.5 9h-2c-.3-.42-.5-.94-.5-1.5v-.2c0-1.28.9-2.4 2.17-2.64l.4-.09.13-.62A2.4 2.4 0 0 1 8.08 2m3.84 0c1.16 0 2.15.82 2.38 1.95l.12.62.41.09A2.7 2.7 0 0 1 17 7.3v.2c0 .73-.31 1.38-.8 1.84a3.25 3.25 0 0 1-.73 6.07 3 3 0 0 1-4.97 1.82V13h2c.83 0 1.5-.67 1.5-1.5v-.59a1.5 1.5 0 1 0-1 0v.59a.5.5 0 0 1-.5.5h-2V2.46q.61-.45 1.42-.46M6.5 12a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m7-3a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m-6-3a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1" />
  </svg>
);

/** Fluent `box_toolbox_20_regular`. */
export const FluentRefToolboxIcon = () => (
  <svg {...base}>
    <path d="M11.3 2.48a3.5 3.5 0 0 0-2.6 0l-5.76 2.3A1.5 1.5 0 0 0 2 6.18v7.64c0 .62.37 1.17.94 1.4l5.76 2.3.3.1v-1.06L3.31 14.3a.5.5 0 0 1-.31-.47V6.24l6.5 2.6V12q.4-.52 1-.8V8.85l6.5-2.6V9.5c.5.37.84.91.96 1.54l.04.01V6.18a1.5 1.5 0 0 0-.94-1.4zm-2.23.93a2.5 2.5 0 0 1 1.86 0l5.22 2.09-2.27.91-6.16-2.46zm-2.7 1.08 6.16 2.46L10 7.96 3.85 5.5zm5.63 7.5v-.5c0-.82.67-1.49 1.5-1.49h2c.83 0 1.5.67 1.5 1.5v.5h.5c.83 0 1.5.67 1.5 1.5V15h-2v-.5a.5.5 0 0 0-1 0v.5h-3v-.5a.5.5 0 0 0-1 0v.5h-2v-1.5c0-.83.67-1.5 1.5-1.5zm3.5-1h-2a.5.5 0 0 0-.5.5v.5h3v-.5a.5.5 0 0 0-.5-.5M17 16.5V16h2v1.5c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V16h2v.5a.5.5 0 1 0 1 0V16h3v.5a.5.5 0 1 0 1 0" />
  </svg>
);

/** Fluent `box_toolbox_20_filled`. */
export const FluentRefToolboxFilledIcon = () => (
  <svg {...base}>
    <path d="M17.42 5 14.38 6.2l-7.5-3 1.82-.73a3.5 3.5 0 0 1 2.6 0l5.76 2.3q.2.09.36.21M10 7.95l3.03-1.21-7.5-3-2.59 1.03a2 2 0 0 0-.36.21zm-7.96-2.1Q2 6 2 6.17v7.64c0 .62.37 1.17.94 1.4l5.76 2.3.3.1V13.5q.02-.85.5-1.5V8.84zM18 6.17v4.87h-.04A2.5 2.5 0 0 0 15.5 9h-2a2.5 2.5 0 0 0-2.46 2.04q-.28.06-.54.17V8.84l7.46-2.99q.04.16.04.33M12 12v-.5c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v.5h.5c.83 0 1.5.67 1.5 1.5V15h-2v-.5a.5.5 0 0 0-1 0v.5h-3v-.5a.5.5 0 0 0-1 0v.5h-2v-1.5c0-.83.67-1.5 1.5-1.5zm1-.5v.5h3v-.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5m4 5V16h2v1.5c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V16h2v.5a.5.5 0 1 0 1 0V16h3v.5a.5.5 0 1 0 1 0" />
  </svg>
);

/** Fluent `scan_text_16_regular`. */
export const FluentRefScanTextIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v1a.5.5 0 0 1-1 0v-1A2.5 2.5 0 0 1 3.5 1h1a.5.5 0 0 1 0 1zm0 12A1.5 1.5 0 0 1 2 12.5v-1a.5.5 0 0 0-1 0v1A2.5 2.5 0 0 0 3.5 15h1a.5.5 0 0 0 0-1zM14 3.5c0-.83-.67-1.5-1.5-1.5h-1a.5.5 0 0 1 0-1h1A2.5 2.5 0 0 1 15 3.5v1a.5.5 0 0 1-1 0zM12.5 14c.83 0 1.5-.67 1.5-1.5v-1a.5.5 0 0 1 1 0v1a2.5 2.5 0 0 1-2.5 2.5h-1a.5.5 0 0 1 0-1zm-8-6c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m.5 2a.5.5 0 0 0 0 1h3.5a.5.5 0 0 0 0-1zm-.5-4.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `scan_text_16_filled`. */
export const FluentRefScanTextFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2.5a1 1 0 0 0-1 1v.75a.75.75 0 0 1-1.5 0V3.5A2.5 2.5 0 0 1 3.5 1h.75a.75.75 0 0 1 0 1.5zm0 11a1 1 0 0 1-1-1v-.75a.75.75 0 0 0-1.5 0v.75A2.5 2.5 0 0 0 3.5 15h.75a.75.75 0 0 0 0-1.5zm10-10a1 1 0 0 0-1-1h-.75a.75.75 0 0 1 0-1.5h.75A2.5 2.5 0 0 1 15 3.5v.75a.75.75 0 0 1-1.5 0zm-1 10a1 1 0 0 0 1-1v-.75a.75.75 0 0 1 1.5 0v.75a2.5 2.5 0 0 1-2.5 2.5h-.75a.75.75 0 0 1 0-1.5zm-8-8.25c0-.41.34-.75.75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75M5.25 10a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5zM4.5 8c0-.41.34-.75.75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 4.5 8" />
  </svg>
);

/** Fluent `select_all_on_16_regular`. */
export const FluentRefTextSelectIcon = () => (
  <svg {...base}>
    <path d="M9.85 5.85a.5.5 0 0 0-.7-.7L6.5 7.79 5.35 6.65a.5.5 0 1 0-.7.7l1.5 1.5c.2.2.5.2.7 0zM2 4.5A2.5 2.5 0 0 1 4.5 2h5A2.5 2.5 0 0 1 12 4.5v5A2.5 2.5 0 0 1 9.5 12h-5A2.5 2.5 0 0 1 2 9.5zM4.5 3C3.67 3 3 3.67 3 4.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5zM7 14a2.5 2.5 0 0 1-2-1h4.5A3.5 3.5 0 0 0 13 9.5V4c.6.46 1 1.18 1 2v3.5A4.5 4.5 0 0 1 9.5 14z" />
  </svg>
);

/** Fluent `select_all_on_16_filled`. */
export const FluentRefTextSelectFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v5A2.5 2.5 0 0 0 4.5 12h5A2.5 2.5 0 0 0 12 9.5v-5A2.5 2.5 0 0 0 9.5 2zm5.35 3.85-3 3a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 1 1 .7-.7L6.5 7.79l2.65-2.64a.5.5 0 1 1 .7.7M5 13c.46.6 1.18 1 2 1h2.5A4.5 4.5 0 0 0 14 9.5V6c0-.82-.4-1.54-1-2v5.5A3.5 3.5 0 0 1 9.5 13z" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_regular`. */
export const FluentRefTableOfContentsIcon = () => (
  <svg {...base}>
    <path d="M2 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m4.5 4a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_bullet_list_tree_16_filled`. */
export const FluentRefTableOfContentsFilledIcon = () => (
  <svg {...base}>
    <path d="M2.25 5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m0 4.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.75 3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M5.75 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8m4.25 3.5a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `timeline_20_regular`. */
export const FluentRefTimelineIcon = () => (
  <svg {...base}>
    <path d="M3.5 3C2.67 3 2 3.67 2 4.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5zM3 4.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5zm.5 6.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5zM3 12.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5zm14-.06a2 2 0 0 1-1-3.88 2 2 0 0 1 1 3.88M16.5 3c.28 0 .5.22.5.5v4.04a3 3 0 0 0-1 0V3.5c0-.28.22-.5.5-.5m0 10.5q-.26 0-.5-.04v4.04a.5.5 0 0 0 1 0v-4.04q-.24.04-.5.04" />
  </svg>
);

/** Fluent `timeline_20_filled`. */
export const FluentRefTimelineFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 3C2.67 3 2 3.67 2 4.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5zm0 8c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5zM17 12.44a2 2 0 0 1-1-3.88 2 2 0 0 1 1 3.88M16.5 3c.28 0 .5.22.5.5v4.04a3 3 0 0 0-1 0V3.5c0-.28.22-.5.5-.5m0 10.5q-.26 0-.5-.04v4.04a.5.5 0 0 0 1 0v-4.04q-.24.04-.5.04" />
  </svg>
);

/** Fluent `line_style_20_regular`. */
export const FluentRefLineStyleIcon = () => (
  <svg {...base}>
    <path d="M2 4.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m6 0c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m6 0c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5M3 14a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z" />
  </svg>
);

/** Fluent `line_style_20_filled`. */
export const FluentRefLineStyleFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.75c0-.41.34-.75.75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 2 4.75m6 0c0-.41.34-.75.75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 8 4.75m6 0c0-.41.34-.75.75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75m-12 5c0-.41.34-.75.75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75M3.25 14a1.25 1.25 0 1 0 0 2.5h13.5a1.25 1.25 0 1 0 0-2.5z" />
  </svg>
);

/** Fluent `document_dismiss_16_regular`. */
export const FluentRefFileXIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H8.66q.6-.42 1.08-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6.5 2h2.3L10 2.2v2.3c0 .28.22.5.5.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `document_dismiss_16_filled`. */
export const FluentRefFileXFilledIcon = () => (
  <svg {...base}>
    <path d="M9 4.5V1H5.5C4.67 1 4 1.67 4 2.5v2.7A5.5 5.5 0 0 1 8.66 15h3.84c.83 0 1.5-.67 1.5-1.5V6h-3.5A1.5 1.5 0 0 1 9 4.5m1 0V1.25L13.75 5H10.5a.5.5 0 0 1-.5-.5M2.32 7.32a4.5 4.5 0 1 0 6.36 6.36 4.5 4.5 0 0 0-6.36-6.36m4.95 4.95a.5.5 0 0 1-.7 0L5.5 11.2l-1.06 1.06a.5.5 0 0 1-.7-.7l1.05-1.07-1.06-1.06a.5.5 0 0 1 .7-.7L5.5 9.78l1.06-1.06a.5.5 0 0 1 .7.7L6.22 10.5l1.06 1.06c.2.2.2.51 0 .7" />
  </svg>
);

/** Fluent `document_question_mark_16_regular`. */
export const FluentRefFileQuestionIcon = () => (
  <svg {...base}>
    <path d="M6 1a2 2 0 0 0-2 2v2.2q.49-.13 1-.18V3a1 1 0 0 1 1-1h3v2.5c0 .83.67 1.5 1.5 1.5H13v7a1 1 0 0 1-1 1H9.74q-.46.57-1.07 1H12a2 2 0 0 0 2-2V5.42q-.01-.62-.44-1.06l-2.92-2.92A1.5 1.5 0 0 0 9.58 1zm4 3.5V2.21l2.8 2.8h-2.3a.5.5 0 0 1-.5-.5m0 6a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0m-4.5 1.88a.62.62 0 1 1 0 1.25.62.62 0 0 1 0-1.25m0-4.88c1.03 0 1.85.85 1.85 1.95 0 .59-.21.91-.72 1.32l-.28.22c-.25.19-.33.3-.35.44v.16a.5.5 0 0 1-1-.09c0-.57.21-.88.72-1.29l.27-.21c.3-.23.36-.35.36-.55 0-.55-.38-.95-.85-.95-.5 0-.86.37-.85.95a.5.5 0 0 1-1 0c-.01-1.13.8-1.95 1.85-1.95" />
  </svg>
);

/** Fluent `document_question_mark_16_filled`. */
export const FluentRefFileQuestionFilledIcon = () => (
  <svg {...base}>
    <path d="M6 1h3v3.5c0 .83.67 1.5 1.5 1.5H14v7a2 2 0 0 1-2 2H8.67A5.5 5.5 0 0 0 4 5.2V3c0-1.1.9-2 2-2m4.5 4H14l-4-4v3.5c0 .28.22.5.5.5m-.5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.5 1.88a.62.62 0 1 0 0 1.25.62.62 0 0 0 0-1.25m0-4.88c-1.05 0-1.86.82-1.85 1.96a.5.5 0 0 0 1-.01c0-.58.36-.95.85-.95.47 0 .85.4.85.95 0 .2-.07.32-.36.55l-.27.21c-.51.4-.72.72-.72 1.29a.5.5 0 0 0 1 .09v-.16c.02-.14.1-.25.35-.44l.28-.22c.5-.4.72-.73.72-1.32 0-1.1-.82-1.95-1.85-1.95" />
  </svg>
);

/** Fluent `document_person_16_regular`. */
export const FluentRefFileUserIcon = () => (
  <svg {...base}>
    <path d="M5 1a2 2 0 0 0-2 2v2.4q.45-.26 1-.36V3a1 1 0 0 1 1-1h3v2.5C8 5.33 8.67 6 9.5 6H12v7a1 1 0 0 1-1 1H8.63q-.28.55-.8.98L7.8 15H11a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06L9.65 1.44A1.5 1.5 0 0 0 8.59 1zm6.8 4H9.5a.5.5 0 0 1-.5-.5V2.2zM6.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 12.5C8 13.75 7 15 4.5 15S1 13.75 1 12.5c0-.83.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `document_person_16_filled`. */
export const FluentRefFileUserFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1v3.5C8 5.33 8.67 6 9.5 6H13v7.5c0 .83-.67 1.5-1.5 1.5H7.81l.02-.02A3.2 3.2 0 0 0 9 12.5c0-1.3-1-2.38-2.27-2.49A3 3 0 0 0 3 5.41V2.5C3 1.67 3.67 1 4.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25zM6.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 12.5C8 13.75 7 15 4.5 15S1 13.75 1 12.5c0-.83.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `folder_sync_16_regular`. */
export const FluentRefFolderSyncIcon = () => (
  <svg {...base}>
    <path d="M2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3H3.5C2.67 3 2 3.67 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v.76a6 6 0 0 0-1-.66v-.1c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7H2v4.5c0 .83.67 1.5 1.5 1.5h2.7q.16.52.4 1H3.5A2.5 2.5 0 0 1 1 11.5zm6 7a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m6.5-3c.28 0 .5.22.5.5v1.5a.5.5 0 0 1-.5.5H12a.5.5 0 0 1 0-1h.47a2 2 0 0 0-1.72-.1 2 2 0 0 0-.66.44.5.5 0 0 1-.71-.71A3 3 0 0 1 13 9.15V9c0-.28.22-.5.5-.5m-.88 5.53a3 3 0 0 1-2.62-.18V14a.5.5 0 0 1-1 0v-1.5c0-.28.22-.5.5-.5H11a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 .94.25 2 2 0 0 0 1.44-.59.5.5 0 0 1 .71.71 3 3 0 0 1-1 .66" />
  </svg>
);

/** Fluent `folder_sync_16_filled`. */
export const FluentRefFolderSyncFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1zM1 7v4.5A2.5 2.5 0 0 0 3.5 14h3.1q-.58-1.14-.6-2.5a5.5 5.5 0 0 1 9-4.24V6.5A2.5 2.5 0 0 0 12.5 4H9.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7zm6 4.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m6.5-3c.28 0 .5.22.5.5v1.5a.5.5 0 0 1-.5.5H12a.5.5 0 0 1 0-1h.47a2 2 0 0 0-1.72-.1 2 2 0 0 0-.66.44.5.5 0 0 1-.71-.71A3 3 0 0 1 13 9.15V9c0-.28.22-.5.5-.5m-.88 5.53a3 3 0 0 1-2.62-.18V14a.5.5 0 0 1-1 0v-1.5c0-.28.22-.5.5-.5H11a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 .94.25 2 2 0 0 0 1.44-.59.5.5 0 0 1 .71.71 3 3 0 0 1-1 .66" />
  </svg>
);

/** Fluent `form_20_regular`. */
export const FluentRefFormIcon = () => (
  <svg {...base}>
    <path d="M5.5 5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm1 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1M8 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0m2-4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m.5 3.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM4 6c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  </svg>
);

/** Fluent `form_20_filled`. */
export const FluentRefFormFilledIcon = () => (
  <svg {...base}>
    <path d="M6.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 3.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm2.5-1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm1 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M8 13.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m1-4c0 .28.22.5.5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5m.5 3.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `table_cells_merge_16_regular`. */
export const FluentRefTableCellsMergeIcon = () => (
  <svg {...base}>
    <path d="M6.35 6.15c.2.2.2.5 0 .7l-.64.65h4.58l-.64-.65a.5.5 0 1 1 .7-.7l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 0 1-.7-.7l.64-.65H5.71l.64.65a.5.5 0 1 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5c.2-.2.5-.2.7 0M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm8.41 2H3.1c.2-.58.76-1 1.41-1h7c.65 0 1.2.42 1.41 1M3 5h10v6H3zm.09 7h9.82c-.2.58-.76 1-1.41 1h-7a1.5 1.5 0 0 1-1.41-1" />
  </svg>
);

/** Fluent `table_cells_merge_16_filled`. */
export const FluentRefTableCellsMergeFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2a2.5 2.5 0 0 0-2.45 2h11.9a2.5 2.5 0 0 0-2.45-2zM2 11V5h12v6zm4.35-4.85a.5.5 0 0 0-.7 0l-1.5 1.5a.5.5 0 0 0 0 .7l1.5 1.5a.5.5 0 0 0 .7-.7l-.64-.65h4.58l-.64.65a.5.5 0 1 0 .7.7l1.5-1.5a.5.5 0 0 0 0-.7l-1.5-1.5a.5.5 0 0 0-.7.7l.64.65H5.71l.64-.65a.5.5 0 0 0 0-.7m7.6 5.85a2.5 2.5 0 0 1-2.45 2h-7a2.5 2.5 0 0 1-2.45-2z" />
  </svg>
);

/** Fluent `table_cells_split_16_regular`. */
export const FluentRefTableCellsSplitIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM3.09 4H7V3H4.5c-.65 0-1.2.42-1.41 1M8 3v1h4.91c-.2-.58-.76-1-1.41-1zm5 2H3v6h10zm-.09 7H8v1h3.5c.65 0 1.2-.42 1.41-1M7 13v-1H3.09c.2.58.76 1 1.41 1zm0-3V6h1v4z" />
  </svg>
);

/** Fluent `table_cells_split_16_filled`. */
export const FluentRefTableCellsSplitFilledIcon = () => (
  <svg {...base}>
    <path d="M8 4h5.95a2.5 2.5 0 0 0-2.45-2H8zM7 2H4.5a2.5 2.5 0 0 0-2.45 2H7zm1 12h3.5a2.5 2.5 0 0 0 2.45-2H8zm-1-2H2.05a2.5 2.5 0 0 0 2.45 2H7zm-5-1V5h12v6zm5-5v4h1V6z" />
  </svg>
);

/** Fluent `person_search_16_regular`. */
export const FluentRefPersonSearchIcon = () => (
  <svg {...base}>
    <path d="M12.5 8c.83 0 1.5.67 1.5 1.5v.5c0 1.74-1.45 3.53-3.96 3.92L9.12 13c2.5-.05 3.88-1.58 3.88-3v-.5a.5.5 0 0 0-.5-.5H8.74q-.19-.54-.5-1zM9 1.5A2.75 2.75 0 1 1 9 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 9 6a1.75 1.75 0 0 0 0-3.5M4.5 14c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L7.3 12.6A3.5 3.5 0 1 0 4.5 14m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `person_search_16_filled`. */
export const FluentRefPersonSearchFilledIcon = () => (
  <svg {...base}>
    <path d="M12.5 8c.83 0 1.5.67 1.5 1.5v.5c0 1.74-1.45 3.53-3.96 3.92l-1.48-1.48A4.5 4.5 0 0 0 8.24 8zM9 1.5A2.75 2.75 0 1 1 9 7a2.75 2.75 0 0 1 0-5.5M4.5 14c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L7.3 12.6A3.5 3.5 0 1 0 4.5 14m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `person_edit_16_regular`. */
export const FluentRefPersonPenIcon = () => (
  <svg {...base}>
    <path d="M10.5 8q.2 0 .4.05L9.93 9H3.5a.5.5 0 0 0-.5.5v.5c0 1.34 1.24 2.78 3.48 2.98l-.05.18-.2.8C3.56 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8zM7 1.5A2.75 2.75 0 1 1 7 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 7 6a1.75 1.75 0 0 0 0-3.5m.98 9.88 4.83-4.83a1.87 1.87 0 1 1 2.64 2.64l-4.83 4.83a2 2 0 0 1-1.02.58l-1.5.37a.9.9 0 0 1-1.07-1.07l.37-1.5q.15-.6.58-1.02" />
  </svg>
);

/** Fluent `person_edit_16_filled`. */
export const FluentRefPersonPenFilledIcon = () => (
  <svg {...base}>
    <path d="M10.5 8q.2 0 .4.05l-3.63 3.62q-.62.63-.84 1.49l-.2.8C3.56 13.66 2 11.8 2 10v-.5C2 8.67 2.67 8 3.5 8zM7 1.5A2.75 2.75 0 1 1 7 7a2.75 2.75 0 0 1 0-5.5m.98 10.88 4.83-4.83a1.87 1.87 0 1 1 2.64 2.64l-4.83 4.83a2 2 0 0 1-1.02.58l-1.5.37a.9.9 0 0 1-1.07-1.07l.37-1.5q.15-.6.58-1.02" />
  </svg>
);

/** Fluent `person_star_16_regular`. */
export const FluentRefPersonStarIcon = () => (
  <svg {...base}>
    <path d="M2 10c0 1.8 1.55 3.65 4.22 3.96a6 6 0 0 1-.72-1.16C3.88 12.33 3 11.13 3 10v-.5c0-.28.22-.5.5-.5h1.7q.16-.52.4-1H3.5C2.67 8 2 8.67 2 9.5zm7.75-5.75q0 .43-.12.82-.73.12-1.39.41A1.74 1.74 0 0 0 7 2.5a1.75 1.75 0 1 0 .4 3.45q-.6.42-1.07.97a2.75 2.75 0 1 1 3.42-2.67M15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.02-2.64a.5.5 0 0 0-.96 0L9.55 9.4H8c-.48 0-.68.65-.3.95l1.26.94-.48 1.53c-.15.49.38.89.77.59l1.25-.95 1.25.95c.4.3.92-.1.77-.59l-.48-1.53 1.25-.94c.4-.3.2-.95-.3-.95h-1.54z" />
  </svg>
);

/** Fluent `person_star_16_filled`. */
export const FluentRefPersonStarFilledIcon = () => (
  <svg {...base}>
    <path d="M6.33 6.92a5.5 5.5 0 0 1 3.3-1.85 2.75 2.75 0 1 0-3.3 1.85M5 10.5q.02-1.36.6-2.5H3.5C2.67 8 2 8.67 2 9.5v.5c0 1.8 1.55 3.65 4.22 3.96A5.5 5.5 0 0 1 5 10.5m10 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4.02-2.64a.5.5 0 0 0-.96 0L9.55 9.4H8c-.48 0-.68.65-.3.95l1.26.94-.48 1.53c-.15.49.38.89.77.59l1.25-.95 1.25.95c.4.3.92-.1.77-.59l-.48-1.53 1.25-.94c.4-.3.2-.95-.3-.95h-1.54z" />
  </svg>
);

/** Fluent `shield_settings_16_regular`. */
export const FluentRefShieldCogIcon = () => (
  <svg {...base}>
    <path d="M9.07 6.75a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52l-.13.42a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.43 2.48l.15.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01l.46-.12a2 2 0 0 0 1.43-2.48l-.16-.56q.38-.3.82-.5zm-1.42-4.6c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-.48-.25-1-.4v-.22a6.6 6.6 0 0 1-4-1.8 6.7 6.7 0 0 1-4 1.8V7.5q.02 2.13 1.02 3.44.08 1 .49 1.86Q3 10.97 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M10.5 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `shield_settings_16_filled`. */
export const FluentRefShieldCogFilledIcon = () => (
  <svg {...base}>
    <path d="M9.07 6.75a2 2 0 0 0 2.9 0l.33-.35q.45.21.84.52l-.13.42a2 2 0 0 0 1.46 2.52l.35.09a5 5 0 0 1 0 1.01l-.45.12a2 2 0 0 0-1.43 2.48l.15.55q-.38.3-.82.5l-.34-.36a2 2 0 0 0-2.9 0l-.33.35q-.45-.21-.84-.52l.13-.42a2 2 0 0 0-1.46-2.52l-.35-.09a5 5 0 0 1 0-1.01l.46-.12a2 2 0 0 0 1.43-2.48l-.16-.56q.38-.3.82-.5zm-1.42-4.6c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v1.1q-1.14-.58-2.5-.6a5.5 5.5 0 0 0-5 7.8Q3.02 10.97 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M10.5 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `mail_checkmark_16_regular`. */
export const FluentRefMailCheckIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 6.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7M12 13v-2.2q.52-.15 1-.4V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h2.02a6 6 0 0 0 0 1H3a1 1 0 0 0-1 1v.74l5 2.7.54-.3q.53.33 1.1.54l-1.4.76a.5.5 0 0 1-.48 0L2 8.88V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1" />
  </svg>
);

/** Fluent `mail_checkmark_16_filled`. */
export const FluentRefMailCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M15 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.15-1.85a.5.5 0 0 0-.7 0L9.5 6.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0l3-3a.5.5 0 0 0 0-.7M10.5 11q1.36-.02 2.5-.6V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8.34l5.76 3.1a.5.5 0 0 0 .48 0l1.4-.76q.89.31 1.86.32M3 5h2.02L5 5.5a5.5 5.5 0 0 0 2.54 4.64l-.54.3L1 7.2V7c0-1.1.9-2 2-2" />
  </svg>
);

/** Fluent `mail_alert_16_regular`. */
export const FluentRefMailWarningIcon = () => (
  <svg {...base}>
    <path d="M7.5 4a3 3 0 0 1 6 0v2l1.32 1.12a.5.5 0 0 1-.33.88H6.5a.5.5 0 0 1-.32-.88L7.5 6zm3 6a1.5 1.5 0 0 1-1.42-1h2.83c-.2.58-.76 1-1.41 1M3 5h3.5v.54L5.95 6H3a1 1 0 0 0-1 1v.74l5 2.7 1.32-.72q.26.46.67.77l-1.75.95a.5.5 0 0 1-.48 0L2 8.88V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2.5q.6-.46.86-1.17l.12-.33H13v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2" />
  </svg>
);

/** Fluent `mail_alert_16_filled`. */
export const FluentRefMailWarningFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 4a3 3 0 0 1 6 0v2l1.32 1.12a.5.5 0 0 1-.33.88H6.5a.5.5 0 0 1-.32-.88L7.5 6zm3 6a1.5 1.5 0 0 1-1.42-1h2.83c-.2.58-.76 1-1.41 1M3 5h3.5v.54l-.97.82A1.5 1.5 0 0 0 6.5 9h1.52l.12.33q.07.2.18.39l-1.33.71L1 7.2V7c0-1.1.9-2 2-2m7.5 6q-.87-.02-1.51-.51l-1.76.95a.5.5 0 0 1-.48 0L1 8.34V13c0 1.1.9 2 2 2h7.98a2 2 0 0 0 2-2V9l-.12.33A2.5 2.5 0 0 1 10.5 11" />
  </svg>
);

/** Fluent `hand_wave_16_regular`. */
export const FluentRefHandWaveIcon = () => (
  <svg {...base}>
    <path d="M9.68 2.75q-.31.07-.56.25a1.5 1.5 0 0 0-1.43-1q-.51 0-.92.32l-.08-.24A1.5 1.5 0 0 0 5.25 1 1.5 1.5 0 0 0 4 1.63q-.14.21-.21.45a1.6 1.6 0 0 0-2 2l1.45 4.66a2.3 2.3 0 0 0-1.92.65 1 1 0 0 0-.31.89 1.3 1.3 0 0 0 .78 1 11 11 0 0 1 3 2.44A4 4 0 0 0 7.69 15q.5 0 1-.14l1.78-.53a2.5 2.5 0 0 0 1.73-2q.3-1.92.31-3.87-.2-2.41-1-4.71a1.54 1.54 0 0 0-1.83-1m1.52 9.46a1.4 1.4 0 0 1-1 1.16l-1.79.53a2.9 2.9 0 0 1-2.9-.9 11 11 0 0 0-3.3-2.66c-.14-.07-.21-.19-.2-.24a1.4 1.4 0 0 1 1.77-.1.51.51 0 0 0 .7-.6L2.76 3.81a.6.6 0 0 1 .31-.74.6.6 0 0 1 .51 0 .6.6 0 0 1 .36.37L5 6.66q.05.14.16.22.15.1.33.12h.16l.12-.07A.4.4 0 0 0 6 6.72v-.36L4.76 2.67a.5.5 0 0 1 .07-.46.54.54 0 0 1 .91.15L7 6.64q.05.15.17.24.13.12.31.12h.14A.5.5 0 0 0 8 6.36l-.8-2.67a.5.5 0 0 1 .08-.47.55.55 0 0 1 1 .19l.32 1.25.48 2q.05.17.2.28.07.04.14.06h.2a.5.5 0 0 0 .38-.62l-.49-2a.58.58 0 0 1 .82-.65q.2.1.26.31.73 2.16.92 4.43 0 1.88-.31 3.74M13.8 1.1a.5.5 0 1 0-.6.8 4.2 4.2 0 0 1 1.32 4.46.5.5 0 0 0 .34.62L15 7a.5.5 0 0 0 .48-.36A5.2 5.2 0 0 0 13.8 1.1m-1.19 1.41.18.08a3.4 3.4 0 0 1 1.17 2.95.5.5 0 0 1-.5.46.5.5 0 0 1-.46-.54 2.4 2.4 0 0 0-.8-2.06.5.5 0 0 1-.1-.69.5.5 0 0 1 .51-.2" />
  </svg>
);

/** Fluent `hand_wave_16_filled`. */
export const FluentRefHandWaveFilledIcon = () => (
  <svg {...base}>
    <path d="M2.07 2.02c.4-.1.8.15.9.55l.97 3.86a.58.58 0 1 0 1.14-.29l-1.06-4.2a.75.75 0 1 1 1.46-.37L6.6 6.1a.59.59 0 0 0 1.14-.28l-.72-2.91a.75.75 0 1 1 1.45-.36l.8 3.22a.6.6 0 1 0 1.14-.3L10 3.92a.75.75 0 0 1 1.45-.37l.75 2.75v.01l.03.09c.14.7.25 1.43.27 2.09.03 1.22-.16 2.8-.3 3.87-.15.95-.83 1.7-1.74 1.97l-1.78.53a3.9 3.9 0 0 1-3.9-1.17 11 11 0 0 0-3-2.43 1.4 1.4 0 0 1-.7-.76 1 1 0 0 1 .24-1.11 2.4 2.4 0 0 1 1.65-.67L1.52 2.93c-.1-.4.15-.8.55-.9m11.36-1.01a.5.5 0 0 1 .37.09 5.2 5.2 0 0 1 1.68 5.54A.5.5 0 0 1 15 7l-.14-.02a.5.5 0 0 1-.34-.62A4.2 4.2 0 0 0 13.2 1.9a.5.5 0 0 1 .23-.9m-.64 1.58a.5.5 0 0 0-.69.12.5.5 0 0 0 .1.69 2.4 2.4 0 0 1 .8 2.06.5.5 0 0 0 .46.54.5.5 0 0 0 .5-.46 3.4 3.4 0 0 0-1.17-2.95" />
  </svg>
);

/** Fluent `gif_16_regular`. */
export const FluentRefGifIcon = () => (
  <svg {...base}>
    <path d="M5.05 6.7c.48-.04.85.04.99.1a.5.5 0 1 0 .45-.89 3 3 0 0 0-1.54-.2c-.96.1-1.95.94-1.95 2.3 0 1.38 1.05 2.3 2.3 2.3.58 0 1.1-.27 1.4-.55.26-.25.3-.58.3-.79v-.96a.5.5 0 0 0-.5-.5h-.8a.5.5 0 1 0 0 1H6v.53c-.15.13-.42.27-.7.27C4.57 9.3 4 8.8 4 8c0-.82.57-1.25 1.05-1.3M9 6.2a.5.5 0 0 0-1 0v3.6a.5.5 0 1 0 1 0zm1.5-.5a.5.5 0 0 0-.5.5v3.6a.5.5 0 0 0 1 0V8.5h1a.5.5 0 0 0 0-1h-1v-.8h1.5a.5.5 0 0 0 0-1zM3.5 2A2.5 2.5 0 0 0 1 4.5v7A2.5 2.5 0 0 0 3.5 14h9a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 12.5 2zM2 4.5C2 3.67 2.67 3 3.5 3h9c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z" />
  </svg>
);

/** Fluent `gif_16_filled`. */
export const FluentRefGifFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h9A2.5 2.5 0 0 1 15 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5zm4.05 2.2c.48-.04.85.04.99.1a.5.5 0 1 0 .45-.89 3 3 0 0 0-1.54-.2c-.96.1-1.95.94-1.95 2.3 0 1.38 1.05 2.3 2.3 2.3.58 0 1.1-.27 1.4-.55.26-.25.3-.58.3-.79v-.96a.5.5 0 0 0-.5-.5h-.8a.5.5 0 0 0 0 1H6v.53c-.15.13-.42.27-.7.27C4.57 9.3 4 8.8 4 8c0-.82.57-1.25 1.05-1.3M9 6.2a.5.5 0 0 0-1 0v3.6a.5.5 0 0 0 1 0zm1.5-.5a.5.5 0 0 0-.5.5v3.6a.5.5 0 0 0 1 0V8.5h1a.5.5 0 0 0 0-1h-1v-.8h1.5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `calendar_cancel_16_regular`. */
export const FluentRefCalendarOffIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m4.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.65-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7l-1.14-1.15z" />
  </svg>
);

/** Fluent `calendar_cancel_16_filled`. */
export const FluentRefCalendarOffFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm2 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-2.65-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7l-1.14-1.15z" />
  </svg>
);

/** Fluent `calendar_search_16_regular`. */
export const FluentRefCalendarSearchIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5H9.12l-1-1h3.38c.83 0 1.5-.67 1.5-1.5V6H3v.03q-.52.05-1 .23V4.5A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5m-8 11c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L6.3 12.6A3.5 3.5 0 1 0 3.5 14m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `calendar_search_16_filled`. */
export const FluentRefCalendarSearchFilledIcon = () => (
  <svg {...base}>
    <path d="M14 11.5V6H3.5a4.5 4.5 0 0 1 4.06 6.44L9.12 14h2.38a2.5 2.5 0 0 0 2.5-2.5m0-7A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zM3.5 14c.79 0 1.51-.26 2.1-.7l2.55 2.55a.5.5 0 1 0 .7-.7L6.3 12.6A3.5 3.5 0 1 0 3.5 14m0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

/** Fluent `calendar_sync_16_regular`. */
export const FluentRefCalendarSyncIcon = () => (
  <svg {...base}>
    <path d="M11.5 2A2.5 2.5 0 0 1 14 4.5v2.1q-.48-.24-1-.4V6H3v5.5c0 .83.67 1.5 1.5 1.5h1.7q.16.52.4 1H4.5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm0 1h-7C3.67 3 3 3.67 3 4.5V5h10v-.5c0-.83-.67-1.5-1.5-1.5M7 11.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m6.5-3c.28 0 .5.22.5.5v1.5a.5.5 0 0 1-.5.5H12a.5.5 0 0 1 0-1h.47a2 2 0 0 0-1.72-.1 2 2 0 0 0-.66.44.5.5 0 0 1-.71-.71A3 3 0 0 1 13 9.15V9c0-.28.22-.5.5-.5m-.88 5.53a3 3 0 0 1-2.62-.18V14a.5.5 0 0 1-1 0v-1.5c0-.28.22-.5.5-.5H11a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 .94.25 2 2 0 0 0 1.44-.59.5.5 0 0 1 .71.71 3 3 0 0 1-1 .66" />
  </svg>
);

/** Fluent `calendar_sync_16_filled`. */
export const FluentRefCalendarSyncFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 6H2v5.5A2.5 2.5 0 0 0 4.5 14h2.1q-.58-1.14-.6-2.5A5.5 5.5 0 0 1 11.5 6M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12zm-7 7a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m6.5-3c.28 0 .5.22.5.5v1.5a.5.5 0 0 1-.5.5H12a.5.5 0 0 1 0-1h.47a2 2 0 0 0-1.72-.1 2 2 0 0 0-.66.44.5.5 0 0 1-.71-.71A3 3 0 0 1 13 9.15V9c0-.28.22-.5.5-.5m-.88 5.53a3 3 0 0 1-2.62-.18V14a.5.5 0 0 1-1 0v-1.5c0-.28.22-.5.5-.5H11a.5.5 0 0 1 0 1h-.47a2 2 0 0 0 .94.25 2 2 0 0 0 1.44-.59.5.5 0 0 1 .71.71 3 3 0 0 1-1 .66" />
  </svg>
);

/** Fluent `scan_qr_code_24_regular`. */
export const FluentRefScanQrIcon = () => (
  <svg {...base}>
    <path d="M5.25 3.5c-.97 0-1.75.78-1.75 1.75v3a.75.75 0 0 1-1.5 0v-3C2 3.45 3.46 2 5.25 2h3a.75.75 0 0 1 0 1.5zm0 17c-.97 0-1.75-.78-1.75-1.75v-3a.75.75 0 0 0-1.5 0v3C2 20.55 3.46 22 5.25 22h3a.75.75 0 0 0 0-1.5zM20.5 5.25c0-.97-.78-1.75-1.75-1.75h-3a.75.75 0 0 1 0-1.5h3C20.55 2 22 3.46 22 5.25v3a.75.75 0 0 1-1.5 0zM18.75 20.5c.97 0 1.75-.78 1.75-1.75v-3a.75.75 0 0 1 1.5 0v3c0 1.8-1.46 3.25-3.25 3.25h-3a.75.75 0 0 1 0-1.5zM7 7h3v3H7zm7 3h-4v4H7v3h3v-3h4v3h3v-3h-3zm0 0V7h3v3z" />
  </svg>
);

/** Fluent `scan_qr_code_24_filled`. */
export const FluentRefScanQrFilledIcon = () => (
  <svg {...base}>
    <path d="M5.25 4C4.56 4 4 4.56 4 5.25V8a1 1 0 0 1-2 0V5.25C2 3.45 3.46 2 5.25 2H8a1 1 0 0 1 0 2zm0 16C4.56 20 4 19.44 4 18.75V16a1 1 0 1 0-2 0v2.75C2 20.55 3.46 22 5.25 22H8a1 1 0 1 0 0-2zM20 5.25C20 4.56 19.44 4 18.75 4H16a1 1 0 1 1 0-2h2.75C20.55 2 22 3.46 22 5.25V8a1 1 0 1 1-2 0zM18.75 20c.69 0 1.25-.56 1.25-1.25V16a1 1 0 1 1 2 0v2.75c0 1.8-1.46 3.25-3.25 3.25H16a1 1 0 1 1 0-2zM7 7h3v3H7zm7 3h-4v4H7v3h3v-3h4v3h3v-3h-3zm0 0V7h3v3z" />
  </svg>
);

/** Fluent `wifi_3_20_regular`. */
export const FluentRefWifiLowIcon = () => (
  <svg {...base}>
    <path d="M12.89 11.85q.53.55.85 1.26a.5.5 0 1 1-.92.4 3.03 3.03 0 0 0-5.56-.01.5.5 0 0 1-.92-.4q.3-.72.84-1.25a4.03 4.03 0 0 1 5.7 0m-1.93 1.94a1.3 1.3 0 1 1-1.83 1.83 1.3 1.3 0 0 1 1.83-1.83" />
  </svg>
);

/** Fluent `wifi_3_20_filled`. */
export const FluentRefWifiLowFilledIcon = () => (
  <svg {...base}>
    <path d="M12.95 11.84q.56.55.87 1.28a.75.75 0 0 1-1.37.6q-.2-.47-.56-.82a2.63 2.63 0 0 0-4.26.81.75.75 0 1 1-1.38-.6q.32-.71.86-1.27a4.13 4.13 0 0 1 5.84 0m-2.03 2.04a1.24 1.24 0 1 1-1.76 1.76 1.24 1.24 0 0 1 1.76-1.76" />
  </svg>
);

/** Fluent `globe_off_16_regular`. */
export const FluentRefGlobeOffIcon = () => (
  <svg {...base}>
    <path d="M11.87 12.58a6 6 0 0 1-8.46-8.46L1.16 1.86a.5.5 0 1 1 .7-.7l13 13a.5.5 0 0 1-.7.7zm-.7-.7-.63-.63a7 7 0 0 1-.58 1.35 5 5 0 0 0 1.2-.73M9.28 10 6.07 6.77a11 11 0 0 0 .1 3.23zM5 8q0-1.05.16-2H3.42a5 5 0 0 0 0 4h1.74Q5 9.05 5 8m.78 4.1q-.23-.5-.4-1.1H4c.52.7 1.23 1.25 2.04 1.6q-.14-.24-.26-.5m3.53-.42q.14-.3.26-.68H6.43q.12.37.26.68C7.12 12.64 7.63 13 8 13s.88-.36 1.31-1.32M9.82 6q.16.87.18 1.88l.97.97A13 13 0 0 0 10.84 6h1.74a5 5 0 0 1 0 4h-.46l1.05 1.05Q13.98 9.68 14 8a6 6 0 0 0-9.05-5.17L6.61 4.5l.08-.17C7.12 3.36 7.63 3 8 3s.88.36 1.31 1.32q.14.3.26.68H7.12l1 1zM12 5h-1.38a8 8 0 0 0-.66-1.6c.81.35 1.52.9 2.04 1.6" />
  </svg>
);

/** Fluent `globe_off_16_filled`. */
export const FluentRefGlobeOffFilledIcon = () => (
  <svg {...base}>
    <path d="m11.87 12.58 2.28 2.27a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7l2.27 2.28q-.35.4-.62.87h1.5l1.75 1.75A16 16 0 0 0 6.12 10H9.3l1.36 1.36q-.16.78-.42 1.42-.2.53-.45.95a6 6 0 0 0 2.1-1.15M6.45 4.33l.67.67h2.59q-.17-.8-.4-1.42a4 4 0 0 0-.7-1.23C8.35 2.08 8.15 2 8 2s-.36.08-.6.35q-.38.4-.7 1.23-.13.35-.25.75M8.12 6 10 7.88q0-1-.12-1.88zm2.86 2.86L12.12 10h1.54a6 6 0 0 0 0-4h-2.78a17 17 0 0 1 .1 2.86M13.12 11l.05.05.03-.05zM4.95 2.83l.7.7a8 8 0 0 1 .57-1.26q-.67.21-1.27.56M5.12 10a17 17 0 0 1 0-4H2.34a6 6 0 0 0 0 4zM2.8 11h2.47q.2.99.5 1.78.2.53.45.95A6 6 0 0 1 2.8 11m6.9 0q-.15.8-.4 1.42-.32.83-.7 1.23c-.24.27-.44.35-.6.35s-.36-.08-.6-.35a4 4 0 0 1-.7-1.23q-.25-.63-.4-1.42zm1.03-6h2.47a6 6 0 0 0-3.42-2.73q.26.42.45.95.3.8.5 1.78" />
  </svg>
);

/** Fluent `book_add_20_regular`. */
export const FluentRefBookAddIcon = () => (
  <svg {...base}>
    <path d="M14 3H6a1 1 0 0 0-1 1v11h4.02q.05.51.19 1H5a1 1 0 0 0 1 1h3.6q.27.54.66 1H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5.2q-.49-.13-1-.18V4a1 1 0 0 0-1-1M6 5v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m1 0h6v1H7zm12 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15z" />
  </svg>
);

/** Fluent `book_add_20_filled`. */
export const FluentRefBookAddFilledIcon = () => (
  <svg {...base}>
    <path d="M4 4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5.2A5.5 5.5 0 0 0 9.2 16H5a1 1 0 0 0 1 1h3.6q.27.54.66 1H6a2 2 0 0 1-2-2zm10.5 15a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m0-7c.28 0 .5.22.5.5V14h1.5a.5.5 0 0 1 0 1H15v1.5a.5.5 0 0 1-1 0V15h-1.5a.5.5 0 0 1 0-1H14v-1.5c0-.28.22-.5.5-.5M6.75 4a.75.75 0 0 0-.75.75v.5c0 .41.34.75.75.75h6.5c.41 0 .75-.34.75-.75v-.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Fluent `gavel_16_regular`. */
export const FluentRefGavelIcon = () => (
  <svg {...base}>
    <path d="M7.47 2.2a.5.5 0 0 1 .78.09l.3.46-2.8 2.8-.46-.3a.5.5 0 0 1-.08-.78zm-.86 3.9L9.1 3.6l1.11 1.73q.18.27.45.45L12.4 6.9 9.9 9.4 8.8 7.66a2 2 0 0 0-.45-.45zm6.64 1.36.46.3c.27.17.3.54.08.77l-2.26 2.26a.5.5 0 0 1-.78-.08l-.3-.46zM9.09 1.75a1.5 1.5 0 0 0-2.32-.25L4.5 3.77a1.5 1.5 0 0 0 .25 2.32L6.17 7 1.6 11.6a2 2 0 1 0 2.82 2.83L9 9.83l.91 1.42c.52.8 1.65.93 2.32.25l2.27-2.27a1.5 1.5 0 0 0-.25-2.32L11.2 4.95a1 1 0 0 1-.15-.15zm-.65 7.22-4.73 4.74a1 1 0 0 1-1.42-1.41l4.74-4.74.77.5a1 1 0 0 1 .15.14zM8 14.5c0-.28.22-.5.5-.5H10a.5.5 0 0 1 0-1h3a.5.5 0 1 1 0 1h1.5a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `gavel_16_filled`. */
export const FluentRefGavelFilledIcon = () => (
  <svg {...base}>
    <path d="M6.77 1.5a1.5 1.5 0 0 1 2.32.25l.18.28-4.24 4.24-.28-.18a1.5 1.5 0 0 1-.25-2.32zm-.88 5.32L9.82 2.9l1.23 1.9a1 1 0 0 0 .15.16l1.91 1.23-3.93 3.93-1.23-1.9a1 1 0 0 0-.15-.16zm3.84 4.15.18.28c.52.8 1.65.93 2.32.25l2.27-2.27a1.5 1.5 0 0 0-.25-2.32l-.28-.18zM5.88 8.01l-4.44 4.43a1.5 1.5 0 1 0 2.12 2.12L8 10.13l-.84-1.3zM10 13a.5.5 0 0 0 0 1H8.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H13a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `tag_multiple_16_regular`. */
export const FluentRefTagsIcon = () => (
  <svg {...base}>
    <path d="M11.36 4.66c-.3.3-.8.3-1.1 0a.76.76 0 0 1 0-1.08c.3-.3.8-.3 1.1 0s.3.78 0 1.08m-8.82 4.5a2 2 0 0 1 0-2.83L7.29 1.6c.38-.37.89-.58 1.42-.59L11.97 1A2 2 0 0 1 14 3.02l-.03 3.37a2 2 0 0 1-.59 1.4L8.7 12.45c-.78.78-2.06.78-2.84 0zm.7-2.12a1 1 0 0 0 0 1.41l3.32 3.3c.39.38 1.03.38 1.42 0l4.69-4.67a1 1 0 0 0 .3-.7l.02-3.37A1 1 0 0 0 11.98 2l-3.27.01q-.41 0-.7.3zM2 9.75a2 2 0 0 0 .46 2.11l1.96 1.97a4 4 0 0 0 5.66 0l3.48-3.48c.28-.28.44-.67.44-1.06V8.5l-3.92 3.92-.21.2-.5.5a3 3 0 0 1-4.24 0l-.5-.5-.2-.2-1.97-1.97A2 2 0 0 1 2 9.75" />
  </svg>
);

/** Fluent `tag_multiple_16_filled`. */
export const FluentRefTagsFilledIcon = () => (
  <svg {...base}>
    <path d="M7.3 1.6 2.52 6.33a2 2 0 0 0 0 2.83l3.31 3.28c.8.78 2.07.78 2.85 0l4.7-4.65a2 2 0 0 0 .58-1.4L14 3A2 2 0 0 0 11.97 1l-3.26.01c-.53 0-1.04.22-1.42.59m4.05 3.06c-.3.3-.79.3-1.09 0a.76.76 0 0 1 0-1.08c.3-.3.8-.3 1.1 0s.3.78 0 1.08M2 9.75a2 2 0 0 0 .46 2.11l1.96 1.97a4 4 0 0 0 5.66 0l3.48-3.48c.28-.28.44-.67.44-1.06V8.5l-3.92 3.92-.21.2-.5.5a3 3 0 0 1-4.24 0l-.5-.5-.2-.2-1.97-1.97A2 2 0 0 1 2 9.75" />
  </svg>
);

/** Fluent `vote_16_regular`. */
export const FluentRefVoteIcon = () => (
  <svg {...base}>
    <path d="M7.38 2.5a1 1 0 0 1 1.37-.37L11 3.43a1 1 0 0 1 .37 1.37L10.09 7H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.67a1 1 0 0 1-.18-1.23zM7.62 7h1.32l1.56-2.7L8.25 3 6.36 6.27zm-3.1-2h.26l-.15.27a2 2 0 0 0-.26.75.5.5 0 0 0-.26.19L2.1 9H13.9l-2-2.8-.12-.1.46-.8.04-.08q.26.15.44.4l2.01 2.83q.28.39.28.87v3.18c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5V9.32q0-.48.28-.87l2.01-2.82c.29-.4.74-.63 1.22-.63M14 10H2v2.5c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5z" />
  </svg>
);

/** Fluent `vote_16_filled`. */
export const FluentRefVoteFilledIcon = () => (
  <svg {...base}>
    <path d="M7.38 2.5a1 1 0 0 1 1.37-.37L11 3.43a1 1 0 0 1 .37 1.37L10.09 7H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.67a1 1 0 0 1-.18-1.23zM7.62 7h1.32l1.56-2.7L8.25 3 6.36 6.27zM4.78 5h-.27c-.48 0-.93.23-1.22.63L1.28 8.45a1.5 1.5 0 0 0-.28.87v3.18c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5V9.32q0-.48-.28-.87l-2.01-2.82a2 2 0 0 0-.44-.4l-.04.07-.46.8.12.1 2 2.8H2.1l2-2.8a.5.5 0 0 1 .26-.18 2 2 0 0 1 .26-.75z" />
  </svg>
);

/** Fluent `text_quote_16_regular`. */
export const FluentRefTextQuoteIcon = () => (
  <svg {...base}>
    <path d="M11 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.89 2.8a7.3 7.3 0 0 1-2.24 4.35.5.5 0 0 0 .7.7C12.47 9.73 13 7.6 13 5a2 2 0 1 0-1.11 1.8M5 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.89 2.8a7.3 7.3 0 0 1-2.24 4.35.5.5 0 0 0 .7.7C6.47 9.73 7 7.6 7 5a2 2 0 1 0-1.11 1.8" />
  </svg>
);

/** Fluent `text_quote_16_filled`. */
export const FluentRefTextQuoteFilledIcon = () => (
  <svg {...base}>
    <path d="M9.65 11.15a7.3 7.3 0 0 0 2.24-4.36A2 2 0 1 1 13 5c0 2.6-.53 4.74-2.65 6.86a.5.5 0 0 1-.7-.7m-6 0a7.3 7.3 0 0 0 2.24-4.36A2 2 0 1 1 7 5c0 2.6-.53 4.74-2.65 6.86a.5.5 0 0 1-.7-.7" />
  </svg>
);

/** Fluent `location_add_16_regular`. */
export const FluentRefLocationAddIcon = () => (
  <svg {...base}>
    <path d="M8 4c.28 0 .5.22.5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5c0-.28.22-.5.5-.5m6 3c0 2.87-3.1 6.02-4.84 7.56-.67.59-1.65.59-2.32 0C5.1 13.02 2 9.87 2 7a6 6 0 1 1 12 0m-1 0A5 5 0 0 0 3 7c0 1.1.61 2.4 1.57 3.68a21 21 0 0 0 2.93 3.13c.3.25.7.25 1 0 .84-.75 2-1.87 2.93-3.13C12.39 9.4 13 8.11 13 7" />
  </svg>
);

/** Fluent `location_add_16_filled`. */
export const FluentRefLocationAddFilledIcon = () => (
  <svg {...base}>
    <path d="M9.16 14.54C10.9 13.01 14 9.88 14 7A6 6 0 0 0 2 7c0 2.88 3.1 6.01 4.84 7.54.67.6 1.65.6 2.32 0M8 4c.28 0 .5.22.5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `arrow_circle_up_right_16_regular`. */
export const FluentRefArrowUpRightCircleIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1m3 4.5a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h3.3L5.64 9.65a.5.5 0 0 0 .7.7L10 6.71V10a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `arrow_circle_up_right_16_filled`. */
export const FluentRefArrowUpRightCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m10-2.5V10a.5.5 0 0 1-1 0V6.7l-3.65 3.65a.5.5 0 0 1-.7-.7L9.29 6H6a.5.5 0 0 1 0-1h4.5c.28 0 .5.22.5.5" />
  </svg>
);

/** Fluent `arrow_repeat_1_16_regular`. */
export const FluentRefRepeatOnceIcon = () => (
  <svg {...base}>
    <path d="M12.9 5.24A4 4 0 0 1 14 8.25a5 5 0 0 0-1-.22V8a3 3 0 0 0-.87-2.1.5.5 0 0 1 .69-.72zM8.25 11q-.18.48-.23 1H6.7l1.15 1.15c.17.17.19.44.05.64l-.05.07a.5.5 0 0 1-.64.05l-.07-.05-2-2a.5.5 0 0 1-.06-.64l.06-.07 2-2a.5.5 0 0 1 .76.63l-.05.07L6.7 11zm.52-8.91.07.05 2 2 .06.08a.5.5 0 0 1 0 .56l-.05.07-2 2-.08.06a.5.5 0 0 1-.56 0l-.07-.05-.06-.07a.5.5 0 0 1 0-.57l.06-.07L9.29 5H6a3 3 0 0 0-3 2.82V8c0 .82.33 1.56.86 2.1a.5.5 0 0 1-.71.7A4 4 0 0 1 5.8 4h3.5L8.14 2.85l-.06-.07a.5.5 0 0 1 .7-.7M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-2.95-2.66a.6.6 0 0 0-.68.23c-.21.3-.58.73-1.1.98a.5.5 0 1 0 .45.9q.45-.24.78-.53v3.08a.5.5 0 0 0 1 0v-4.08a.6.6 0 0 0-.45-.58" />
  </svg>
);

/** Fluent `arrow_repeat_1_16_filled`. */
export const FluentRefRepeatOnceFilledIcon = () => (
  <svg {...base}>
    <path d="M12.75 5.51q.4.01.62.33l.04.06a4 4 0 0 1 .58 2.35A5 5 0 0 0 12.5 8q0-.76-.4-1.34a.75.75 0 0 1 .64-1.14M8 12.5v-.06L7.55 12h.48q.08-.8.44-1.5h-.91l.72-.72.07-.09a.75.75 0 0 0-1.13-.97l-2 2-.08.08c-.22.3-.2.71.08.98l2 2 .08.07c.27.2.64.2.9 0A5 5 0 0 1 8 12.5M7.72 2.22a.75.75 0 0 1 .98-.07l.08.07 2 2 .07.08c.2.26.2.62.01.89l-.08.09-2 2-.08.07c-.26.2-.62.2-.89.01l-.09-.08-.07-.08a.75.75 0 0 1-.01-.88l.08-.1.72-.72H6a2.5 2.5 0 0 0-2.5 2.34V8q0 .64.29 1.17l.1.18q.1.17.11.38a.75.75 0 0 1-1.39.4A4 4 0 0 1 5.8 4L6 4h2.44l-.72-.72-.07-.09a.75.75 0 0 1 .07-.97M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-2.95-2.66a.6.6 0 0 0-.68.23c-.21.3-.58.73-1.1.98a.5.5 0 1 0 .45.9q.45-.24.78-.53v3.08a.5.5 0 0 0 1 0v-4.08a.6.6 0 0 0-.45-.58" />
  </svg>
);

/** Fluent `camera_switch_20_regular`. */
export const FluentRefSwitchCameraIcon = () => (
  <svg {...base}>
    <path d="M14.85 2.15a.5.5 0 0 0-.7.7L15.29 4H4a2 2 0 0 0-2 2v6.5a.5.5 0 0 0 1 0V6a1 1 0 0 1 1-1h11.3l-1.15 1.15a.5.5 0 0 0 .7.7l2-2a.5.5 0 0 0 0-.7zM16 15a1 1 0 0 0 1-1V7.5a.5.5 0 0 1 1 0V14a2 2 0 0 1-2 2H4.7l1.15 1.15a.5.5 0 0 1-.7.7l-2-2a.5.5 0 0 1 0-.7l2-2a.5.5 0 0 1 .7.7L4.71 15zm-3-5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0" />
  </svg>
);

/** Fluent `camera_switch_20_filled`. */
export const FluentRefSwitchCameraFilledIcon = () => (
  <svg {...base}>
    <path d="M14.15 2.15c.2-.2.5-.2.7 0l2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7-.7L15.29 5H4a1 1 0 0 0-1 1v6.5a.5.5 0 0 1-1 0V6c0-1.1.9-2 2-2h11.3l-1.15-1.15a.5.5 0 0 1 0-.7M17 14a1 1 0 0 1-1 1H4.7l1.15-1.15a.5.5 0 0 0-.7-.7l-2 2a.5.5 0 0 0 0 .7l2 2a.5.5 0 0 0 .7-.7L4.71 16H16a2 2 0 0 0 2-2V7.5a.5.5 0 0 0-1 0zm-4-4a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
  </svg>
);

/** Fluent `arrow_eject_20_regular`. */
export const FluentRefEjectIcon = () => (
  <svg {...base}>
    <path d="M9.6 5.2a.5.5 0 0 1 .8 0l4.5 6a.5.5 0 0 1-.4.8h-9a.5.5 0 0 1-.4-.8zm1.6-.6c-.6-.8-1.8-.8-2.4 0l-4.5 6A1.5 1.5 0 0 0 5.5 13h9a1.5 1.5 0 0 0 1.2-2.4zM4 15a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `arrow_eject_20_filled`. */
export const FluentRefEjectFilledIcon = () => (
  <svg {...base}>
    <path d="M11.2 4.6c-.6-.8-1.8-.8-2.4 0l-4.5 6A1.5 1.5 0 0 0 5.5 13h9a1.5 1.5 0 0 0 1.2-2.4zM4 15a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `closed_caption_off_16_regular`. */
export const FluentRefCaptionsOffIcon = () => (
  <svg {...base}>
    <path d="m12.3 13 1.85 1.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L2.5 3.21A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13zm-1-1H3.5A1.5 1.5 0 0 1 2 10.5v-5c0-.76.57-1.4 1.3-1.49l1.76 1.76C4.4 6.15 4 6.93 4 8c0 1.14.46 1.94 1.18 2.3.7.34 1.52.2 2.07-.35a.5.5 0 1 0-.7-.7.8.8 0 0 1-.93.15C5.34 9.26 5 8.86 5 8s.34-1.26.62-1.4l.2-.07zM8.45 6.34l.73.72a1 1 0 0 1 .43-.46.8.8 0 0 1 .93.15.5.5 0 0 0 .7-.7 1.8 1.8 0 0 0-2.07-.35q-.43.21-.72.64M14 10.5q-.01.58-.38 1l.7.7a2.5 2.5 0 0 0 .68-1.7v-5A2.5 2.5 0 0 0 12.5 3H5.12l1 1h6.38c.83 0 1.5.67 1.5 1.5z" />
  </svg>
);

/** Fluent `closed_caption_off_16_filled`. */
export const FluentRefCaptionsOffFilledIcon = () => (
  <svg {...base}>
    <path d="m12.3 13 1.85 1.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L2.5 3.21A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13zM5.81 6.53l-.2.07C5.34 6.74 5 7.14 5 8s.34 1.26.62 1.4c.3.15.68.1.93-.15a.5.5 0 1 1 .7.7 1.8 1.8 0 0 1-2.07.35C4.46 9.94 4 9.14 4 8c0-1.07.41-1.85 1.06-2.23zm3.8.07a1 1 0 0 0-.43.46l5.14 5.15A2.5 2.5 0 0 0 15 10.5v-5A2.5 2.5 0 0 0 12.5 3H5.12l3.34 3.34q.29-.42.72-.64a1.8 1.8 0 0 1 2.07.35.5.5 0 0 1-.7.7.8.8 0 0 0-.93-.15" />
  </svg>
);

/** Fluent `phone_vibrate_20_regular`. */
export const FluentRefVibrateIcon = () => (
  <svg {...base}>
    <path d="M8.5 14.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM7 2a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM2.92 7.22a.5.5 0 0 0-.84.56l.38.57c.29.42.32.97.1 1.43-.4.78-.34 1.7.14 2.43l.38.57a.5.5 0 1 0 .84-.56l-.38-.57a1.4 1.4 0 0 1-.1-1.43c.4-.78.34-1.7-.14-2.43zm13.3-.14a.5.5 0 0 1 .7.14l.38.57c.48.73.54 1.65.15 2.43-.23.46-.2 1 .09 1.43l.38.57a.5.5 0 1 1-.84.56l-.38-.57a2.4 2.4 0 0 1-.15-2.43c.23-.46.2-1-.09-1.43l-.38-.57a.5.5 0 0 1 .14-.7" />
  </svg>
);

/** Fluent `phone_vibrate_20_filled`. */
export const FluentRefVibrateFilledIcon = () => (
  <svg {...base}>
    <path d="M5 4c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm3.5 10.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM2.92 7.22a.5.5 0 0 0-.84.56l.38.57c.29.42.32.97.1 1.43-.4.78-.34 1.7.14 2.43l.38.57a.5.5 0 1 0 .84-.56l-.38-.57a1.4 1.4 0 0 1-.1-1.43c.4-.78.34-1.7-.14-2.43zm13.3-.14a.5.5 0 0 1 .7.14l.38.57c.48.73.54 1.65.15 2.43-.23.46-.2 1 .09 1.43l.38.57a.5.5 0 1 1-.84.56l-.38-.57a2.4 2.4 0 0 1-.15-2.43c.23-.46.2-1-.09-1.43l-.38-.57a.5.5 0 0 1 .14-.7" />
  </svg>
);

/** Fluent `sim_16_regular`. */
export const FluentRefSimCardIcon = () => (
  <svg {...base}>
    <path d="M5 9.5C5 8.67 5.67 8 6.5 8h3c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-3A1.5 1.5 0 0 1 5 11.5zM6.5 9a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5H8V9zM9 9v3h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zM3 3.5A2.5 2.5 0 0 1 5.5 1h3.17c.66 0 1.3.26 1.77.73l1.83 1.83c.47.47.73 1.1.73 1.77v7.17a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 12.5zM5.5 2C4.67 2 4 2.67 4 3.5v9c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5V5.33c0-.4-.16-.78-.44-1.06L9.73 2.44A1.5 1.5 0 0 0 8.67 2z" />
  </svg>
);

/** Fluent `sim_16_filled`. */
export const FluentRefSimCardFilledIcon = () => (
  <svg {...base}>
    <path d="M5.5 1A2.5 2.5 0 0 0 3 3.5v9A2.5 2.5 0 0 0 5.5 15h5a2.5 2.5 0 0 0 2.5-2.5V5.33c0-.66-.26-1.3-.73-1.77l-1.83-1.83A2.5 2.5 0 0 0 8.67 1zm1 7H8v5H6.5A1.5 1.5 0 0 1 5 11.5v-2C5 8.67 5.67 8 6.5 8M9 8h.5c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5H9z" />
  </svg>
);

/** Fluent `desktop_off_20_regular`. */
export const FluentRefMonitorOffIcon = () => (
  <svg {...base}>
    <path d="m2.28 2.98-.13-.13a.5.5 0 1 1 .7-.7l15 15a.5.5 0 0 1-.7.7L14.29 15H13v2h1.5a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1H7v-2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 .28-1.02M13.29 14 3.03 3.74 3 4v9a1 1 0 0 0 1 1zM17 13a1 1 0 0 1-.89 1l.8.78A2 2 0 0 0 18 13V4a2 2 0 0 0-2-2H4.12l1 1H16a1 1 0 0 1 1 1zm-5 2H8v2h4z" />
  </svg>
);

/** Fluent `desktop_off_20_filled`. */
export const FluentRefMonitorOffFilledIcon = () => (
  <svg {...base}>
    <path d="m14.3 15 2.85 2.85a.5.5 0 0 0 .7-.7l-15-15a.5.5 0 0 0-.7.7Q2 3.15 2 3.5v10c0 .83.67 1.5 1.5 1.5H7v2H5.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1H13v-2zm3.7-1.5c0 .64-.4 1.2-.97 1.4L4.13 2H16.5c.83 0 1.5.67 1.5 1.5zM12 15v2H8v-2z" />
  </svg>
);

/** Fluent `megaphone_off_16_regular`. */
export const FluentRefMegaphoneOffIcon = () => (
  <svg {...base}>
    <path d="m13.3 14 .85.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L4.3 5.02l-2.29.78A1.5 1.5 0 0 0 1 7.22v1.56c0 .65.4 1.22 1.02 1.42l1.98.68V12a3 3 0 0 0 5.87.87l3.15 1.07zm-1.56-1.55-9.4-3.2A.5.5 0 0 1 2 8.79V7.22c0-.22.14-.4.34-.48l2.76-.93zm-2.82.1A2 2 0 0 1 5 12v-.78zM14 3.5v8.38l.96.96q.04-.15.04-.33v-9c0-1.03-1-1.76-1.98-1.43l-6.6 2.23.8.79 6.12-2.07a.5.5 0 0 1 .66.47" />
  </svg>
);

/** Fluent `megaphone_off_16_filled`. */
export const FluentRefMegaphoneOffFilledIcon = () => (
  <svg {...base}>
    <path d="m13.3 14 .85.85a.5.5 0 0 0 .7-.7l-13-13a.5.5 0 1 0-.7.7L4.3 5.02l-2.29.78A1.5 1.5 0 0 0 1 7.22v1.56c0 .65.4 1.22 1.02 1.42l1.98.68V12a3 3 0 0 0 5.87.87l3.15 1.07zM5 11.22l3.92 1.33A2 2 0 0 1 5 12zm10 1.3q0 .16-.04.32L6.43 4.31l6.59-2.23A1.5 1.5 0 0 1 15 3.5z" />
  </svg>
);

/** Fluent `keyboard_off_16_regular`. */
export const FluentRefKeyboardOffIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7L12.29 13H2.75C1.78 13 1 12.22 1 11.25v-6.5c0-.83.57-1.52 1.34-1.7l-1.2-1.2a.5.5 0 0 1 0-.7M13.25 3c.97 0 1.75.78 1.75 1.75v6.5q-.01.69-.46 1.17l-.7-.7q.15-.2.16-.47v-6.5a.75.75 0 0 0-.75-.75H6.12l-1-1zM2.75 4a.75.75 0 0 0-.75.75v6.5c0 .41.34.75.75.75h8.54l-1-1H3.5a.5.5 0 1 1 0-1h5.8l-6-6zm2.5 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m6 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m-8-2a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m6 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m3 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `keyboard_off_16_filled`. */
export const FluentRefKeyboardOffFilledIcon = () => (
  <svg {...base}>
    <path d="M1.15 1.15c.2-.2.5-.2.7 0l13 13a.5.5 0 1 1-.7.7L12.29 13H2.75C1.78 13 1 12.22 1 11.25v-6.5c0-.83.57-1.52 1.34-1.7l-1.2-1.2a.5.5 0 0 1 0-.7M13.25 3c.97 0 1.75.78 1.75 1.75v6.5q-.01.69-.46 1.17L11.11 9l.14.01a.75.75 0 1 0-.74-.6l-1.4-1.41.14.01a.75.75 0 1 0-.74-.6L5.12 3zM3.5 10a.5.5 0 0 0 0 1h6.8l-1-1zm1.75-2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5m-2-2a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5m9 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5" />
  </svg>
);

/** Fluent `tag_add_16_regular`. */
export const FluentRefTagPlusIcon = () => (
  <svg {...base}>
    <path d="M10 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2M1.59 9.14a2 2 0 0 1 0-2.83L6.33 1.6c.37-.37.88-.58 1.4-.59L11 1A2 2 0 0 1 13 3l-.02 2.59q-.48-.25-1-.39L12 3a1 1 0 0 0-1-1L7.73 2a1 1 0 0 0-.7.3L2.3 7.01a1 1 0 0 0 0 1.41l2.74 2.73q.11.9.48 1.68a2 2 0 0 1-.64-.42zM15 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H11z" />
  </svg>
);

/** Fluent `tag_add_16_filled`. */
export const FluentRefTagPlusFilledIcon = () => (
  <svg {...base}>
    <path d="M1.59 6.31a2 2 0 0 0 0 2.83l3.3 3.28a2 2 0 0 0 .63.42 5.5 5.5 0 0 1 7.46-7.25L13 3.01A2 2 0 0 0 10.99 1l-3.25.01c-.53 0-1.04.22-1.41.59zM10 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1H11z" />
  </svg>
);

/** Fluent `paint_brush_16_regular`. */
export const FluentRefPaintRollerIcon = () => (
  <svg {...base}>
    <path d="M3.5 1a.5.5 0 0 0-.5.5V9c0 1.1.9 2 2 2h1v2a2 2 0 1 0 4 0v-2h1a2 2 0 0 0 2-2V1.5a.5.5 0 0 0-.5-.5zM4 7V2h4v1.5a.5.5 0 0 0 1 0V2h1v2.5a.5.5 0 0 0 1 0V2h1v5zm0 1h8v1a1 1 0 0 1-1 1H9.5a.5.5 0 0 0-.5.5V13a1 1 0 1 1-2 0v-2.5a.5.5 0 0 0-.5-.5H5a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `paint_brush_16_filled`. */
export const FluentRefPaintRollerFilledIcon = () => (
  <svg {...base}>
    <path d="M10 4.5V1H9v2.5a.5.5 0 0 1-1 0V1H3.5a.5.5 0 0 0-.5.5V7h10V1.5a.5.5 0 0 0-.5-.5H11v3.5a.5.5 0 0 1-1 0M13 8H3v1c0 1.1.9 2 2 2h1.5v2.5a1.5 1.5 0 0 0 3 0V11H11a2 2 0 0 0 2-2z" />
  </svg>
);

/** Fluent `math_formula_16_regular`. */
export const FluentRefSquareRootIcon = () => (
  <svg {...base}>
    <path d="M8.33 1.23a2.5 2.5 0 0 0-3.52 2.1L4.7 5H3.5a.5.5 0 0 0 0 1h1.13l-.44 6.6a1.5 1.5 0 0 1-2.11 1.26l-.38-.17a.5.5 0 0 0-.4.92l.37.17a2.5 2.5 0 0 0 3.52-2.12L5.63 6H7.5a.5.5 0 1 0 0-1H5.7l.1-1.6a1.5 1.5 0 0 1 2.12-1.26l.37.17a.5.5 0 1 0 .42-.92z" />
    <path d="M8.16 8.05a.25.25 0 0 1 .4.05l1.32 2.32-2.73 2.73a.5.5 0 1 0 .7.7l2.54-2.53 1.19 2.08c.4.71 1.39.84 1.97.26l.3-.3a.5.5 0 0 0-.7-.71l-.3.3a.25.25 0 0 1-.4-.05l-1.33-2.32 2.73-2.73a.5.5 0 1 0-.7-.7L10.6 9.68 9.42 7.6a1.25 1.25 0 0 0-1.97-.26l-.3.3a.5.5 0 1 0 .7.71z" />
  </svg>
);

/** Fluent `math_formula_16_filled`. */
export const FluentRefSquareRootFilledIcon = () => (
  <svg {...base}>
    <path d="M8.75 1.5a2.65 2.65 0 0 0-4.23 1.95L4.45 4.5h-.7a.75.75 0 0 0 0 1.5h.6l-.42 6.3c-.06.82-.9 1.37-1.68 1.08l-.24-.09a.75.75 0 0 0-.52 1.41l.25.1a2.75 2.75 0 0 0 3.69-2.4L5.85 6h1.4a.75.75 0 1 0 0-1.5h-1.3l.07-.95c.06-.92 1.1-1.4 1.83-.85l.2.15a.75.75 0 1 0 .9-1.2z" />
    <path d="M9.64 7.67a1.5 1.5 0 0 0-2.34-.28l-.33.33a.75.75 0 0 0 1.06 1.06l.33-.33 1.2 1.94-2.34 2.33a.75.75 0 0 0 1.06 1.06l2.08-2.08 1 1.63c.51.83 1.66.96 2.34.28l.33-.33a.75.75 0 0 0-1.06-1.06l-.33.33-1.2-1.94 2.34-2.33a.75.75 0 0 0-1.06-1.06L10.64 9.3z" />
  </svg>
);

/** Fluent `document_arrow_up_16_regular`. */
export const FluentRefFileUploadIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2H8.66q.6-.42 1.08-1H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v2.02q-.51.05-1 .19zm6.5 2h2.3L10 2.2v2.3c0 .28.22.5.5.5m-5 10a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m2.35-4.85a.5.5 0 0 1-.7.7L6 9.71v2.79a.5.5 0 0 1-1 0V9.7l-1.15 1.15a.5.5 0 0 1-.7-.7l2-2A.5.5 0 0 1 5.5 8a.5.5 0 0 1 .35.14z" />
  </svg>
);

/** Fluent `document_arrow_up_16_filled`. */
export const FluentRefFileUploadFilledIcon = () => (
  <svg {...base}>
    <path d="M9 4.5V1H5.5C4.67 1 4 1.67 4 2.5v2.7A5.5 5.5 0 0 1 8.66 15h3.84c.83 0 1.5-.67 1.5-1.5V6h-3.5A1.5 1.5 0 0 1 9 4.5m1 0V1.25L13.75 5H10.5a.5.5 0 0 1-.5-.5M5.5 15a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m2.35-4.85a.5.5 0 0 1-.7.7L6 9.71v2.79a.5.5 0 0 1-1 0V9.7l-1.15 1.15a.5.5 0 0 1-.7-.7l2-2A.5.5 0 0 1 5.5 8a.5.5 0 0 1 .35.14z" />
  </svg>
);

/** Fluent `data_area_20_regular`. */
export const FluentRefChartAreaIcon = () => (
  <svg {...base}>
    <path d="M2.5 2c.28 0 .5.22.5.5v6.23l3.8-1.69a.5.5 0 0 1 .45.03l3.2 1.83L15.2 5.1a.5.5 0 0 1 .81.39V17h1.5a.5.5 0 0 1 0 1h-13A2.5 2.5 0 0 1 2 15.5v-13c0-.28.22-.5.5-.5M15 17V6.54l-4.19 3.35a.5.5 0 0 1-.56.04L6.97 8.06 3 9.82v5.68c0 .83.67 1.5 1.5 1.5z" />
  </svg>
);

/** Fluent `data_area_20_filled`. */
export const FluentRefChartAreaFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 2c.41 0 .75.34.75.75v12.5c0 .69.56 1.25 1.25 1.25h12.5a.75.75 0 0 1 0 1.5H4.75A2.75 2.75 0 0 1 2 15.25V2.75c0-.41.34-.75.75-.75M16 5.5v10H4.75a.25.25 0 0 1-.25-.25V8.06l2.3-1.02a.5.5 0 0 1 .45.03l3.2 1.83L15.2 5.1a.5.5 0 0 1 .81.39" />
  </svg>
);

/** Fluent `gift_card_16_regular`. */
export const FluentRefGiftCardIcon = () => (
  <svg {...base}>
    <path d="M1 5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm12 7a1 1 0 0 0 1-1V8H6.7l1.15 1.15a.5.5 0 1 1-.7.7L6 8.71V12zM7.91 7H14V5a1 1 0 0 0-1-1H6v1.09A1.5 1.5 0 0 1 7.91 7M6.5 7a.5.5 0 1 0-.5-.5V7zM5 5.09V4H3a1 1 0 0 0-1 1v2h1.09A1.5 1.5 0 0 1 5 5.09M4.5 7H5v-.5a.5.5 0 1 0-.5.5m-.2 1H2v3a1 1 0 0 0 1 1h2V8.7L3.85 9.86a.5.5 0 0 1-.7-.7z" />
  </svg>
);

/** Fluent `gift_card_16_filled`. */
export const FluentRefGiftCardFilledIcon = () => (
  <svg {...base}>
    <path d="M3 3h2v2.09A1.5 1.5 0 0 0 3.09 7H1V5c0-1.1.9-2 2-2" />
    <path d="m6 8.7 1.15 1.15a.5.5 0 0 0 .7-.7L6.71 8H15v3a2 2 0 0 1-2 2H6z" />
    <path d="M4.3 8 3.14 9.15a.5.5 0 1 0 .7.7L5 8.71V13H3a2 2 0 0 1-2-2V8z" />
    <path d="M7.91 7A1.5 1.5 0 0 0 6 5.09V3h7a2 2 0 0 1 2 2v2z" />
    <path d="M6 6.5V7h.5a.5.5 0 1 0-.5-.5" />
    <path d="M5 6.5V7h-.5a.5.5 0 1 1 .5-.5" />
  </svg>
);

/** Fluent `premium_16_regular`. */
export const FluentRefGemIcon = () => (
  <svg {...base}>
    <path d="M3.5 2a.5.5 0 0 0-.45.28l-2 4a.5.5 0 0 0 .06.54l6.5 8a.5.5 0 0 0 .78 0l6.5-8a.5.5 0 0 0 .06-.54l-2-4A.5.5 0 0 0 12.5 2zM2.3 6l1.5-3h2.06l-.75 3zm.25 1h2.58l1.62 5.16zm3.63 0h3.64L8 12.82zm4.69 0h2.58l-4.2 5.16zm2.82-1h-2.8l-.75-3h2.05zM9.86 6H6.14l.75-3h2.22z" />
  </svg>
);

/** Fluent `premium_16_filled`. */
export const FluentRefGemFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 2a.8.8 0 0 0-.66.4l-2 3.75a.8.8 0 0 0 .07.81l6.25 8a.75.75 0 0 0 1.18 0l6.25-8a.8.8 0 0 0 .07-.81l-2-3.75a.8.8 0 0 0-.66-.4zm-.88 4L4.2 3.5h1.28L4.85 6zm.61 1.5h1.55l1.03 3.3zm3.12 0h2.8L8 11.99zm4.37 0h1.55l-2.58 3.3zM13.13 6h-1.98l-.63-2.5h1.28zM9.6 6H6.4l.62-2.5h1.96z" />
  </svg>
);

/** Fluent `document_pdf_16_regular`. */
export const FluentRefFilePdfIcon = () => (
  <svg {...base}>
    <path d="M2.5 10a1.5 1.5 0 0 1 0 3H2v1.5a.5.5 0 0 1-1 0v-4c0-.28.22-.5.5-.5zM2 12h.5a.5.5 0 0 0 0-1H2zm4-2c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5H5a.5.5 0 0 1-.5-.5v-4c0-.28.22-.5.5-.5zm-.5 4H6a.5.5 0 0 0 .5-.5v-2A.5.5 0 0 0 6 11h-.5zm5.5-4a.5.5 0 0 1 0 1H9.5v1h1a.5.5 0 0 1 0 1h-1v1.5a.5.5 0 0 1-1 0v-4c0-.28.22-.5.5-.5zM9.59 1c.39 0 .78.16 1.06.44l2.91 2.91c.28.28.44.67.44 1.06V13a2 2 0 0 1-2 2h-1.59q.09-.24.09-.5V14H12a1 1 0 0 0 1-1V6h-2.5A1.5 1.5 0 0 1 9 4.5V2H6a1 1 0 0 0-1 1v6q-.58.02-1 .38V3c0-1.1.9-2 2-2zM10 4.5c0 .28.22.5.5.5h2.29L10 2.21z" />
  </svg>
);

/** Fluent `document_pdf_16_filled`. */
export const FluentRefFilePdfFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 10a1.5 1.5 0 0 1 0 3H2v1.5a.5.5 0 0 1-1 0v-4c0-.28.22-.5.5-.5zM2 12h.5a.5.5 0 0 0 0-1H2zm4-2c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5H5a.5.5 0 0 1-.5-.5v-4c0-.28.22-.5.5-.5zm-.5 4H6a.5.5 0 0 0 .5-.5v-2A.5.5 0 0 0 6 11h-.5zm5.5-4a.5.5 0 0 1 0 1H9.5v1h1a.5.5 0 0 1 0 1h-1v1.5a.5.5 0 0 1-1 0v-4c0-.28.22-.5.5-.5zM9 4.5c0 .83.67 1.5 1.5 1.5H14v7.5c0 .83-.67 1.5-1.5 1.5h-2.09q.09-.24.09-.5V14a1.5 1.5 0 0 0 1.3-2.24A1.5 1.5 0 0 0 11 9H9c-.53 0-1 .28-1.27.7A2.5 2.5 0 0 0 6 9H5q-.58.02-1 .38V2.5C4 1.67 4.67 1 5.5 1H9zm4.75.5H10.5a.5.5 0 0 1-.5-.5V1.25z" />
  </svg>
);

/** Fluent `money_hand_16_regular`. */
export const FluentRefHandCoinsIcon = () => (
  <svg {...base}>
    <path d="M3 2.75V3h.5a.5.5 0 0 0 .5-.5V2h-.25a.75.75 0 0 0-.75.75M3.75 1h4.5C9.22 1 10 1.78 10 2.75v.54l2.97 2.98A3.5 3.5 0 0 1 14 8.74v5.76a.5.5 0 0 1-1 0V8.74c0-.66-.26-1.3-.73-1.77L10 4.71v2.58l.85.86a.5.5 0 0 1-.7.7l-.99-.98-.03-.03L7.91 6.6a.74.74 0 1 0-1.05 1.05l1.5 1.49q.14.14.14.35v1a1 1 0 0 0 1 1c.28 0 .5.22.5.5v1.25c0 .97-.78 1.75-1.75 1.75h-4.5C2.78 15 2 14.22 2 13.25V2.75C2 1.78 2.78 1 3.75 1M8 14h.25c.41 0 .75-.34.75-.75V13h-.5a.5.5 0 0 0-.5.5zm.21-1.97a2 2 0 0 1-.7-1.53v-.8l-.2-.19A2 2 0 1 1 6.07 6a1.75 1.75 0 0 1 2.54-.1l.39.4V4h-.5A1.5 1.5 0 0 1 7 2.5V2H5v.5C5 3.33 4.33 4 3.5 4H3v8h.5c.83 0 1.5.67 1.5 1.5v.5h2v-.5c0-.73.52-1.34 1.21-1.47M8.5 3H9v-.25A.75.75 0 0 0 8.25 2H8v.5c0 .28.22.5.5.5M3 13v.25c0 .41.34.75.75.75H4v-.5a.5.5 0 0 0-.5-.5zm3.6-4.2-.44-.44a1.7 1.7 0 0 1-.51-1.3A1 1 0 1 0 6.6 8.8" />
  </svg>
);

/** Fluent `money_hand_16_filled`. */
export const FluentRefHandCoinsFilledIcon = () => (
  <svg {...base}>
    <path d="M2 2.75C2 1.78 2.78 1 3.75 1h4.5C9.22 1 10 1.78 10 2.75v.54l2.97 2.98A3.5 3.5 0 0 1 14 8.74v5.76a.5.5 0 1 1-1 0V8.74c0-.66-.26-1.3-.73-1.77L10 4.71v2.58l.85.86a.5.5 0 0 1-.7.7L8.12 6.82l-.4-.34a.74.74 0 0 0-.86 1.18l1.5 1.49q.14.14.14.35v1a1 1 0 0 0 1 1c.28 0 .5.22.5.5v1.25c0 .97-.78 1.75-1.75 1.75h-4.5C2.78 15 2 14.22 2 13.25zm7 10v-.31a2 2 0 0 1-.79-.41A1.5 1.5 0 0 0 7 13.5v.5h.75q.13 0 .25-.03v-.47c0-.28.22-.5.5-.5h.47q.03-.12.03-.25M7.3 9.51 6.17 8.36A1.74 1.74 0 0 1 6.06 6H6a2 2 0 1 0 1.3 3.51M5 2.5V2h-.75q-.13 0-.25.02v.48a.5.5 0 0 1-.5.5h-.48L3 3.25V4h.5C4.33 4 5 3.33 5 2.5M3.5 12H3v.75q0 .13.02.25h.48c.28 0 .5.22.5.5v.47q.12.03.25.03H5v-.5c0-.83-.67-1.5-1.5-1.5M8 2.5v-.48L7.75 2H7v.5C7 3.33 7.67 4 8.5 4H9v-.75q0-.13-.03-.25H8.5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `box_checkmark_16_regular`. */
export const FluentRefPackageCheckIcon = () => (
  <svg {...base}>
    <path d="M6.92 1.38a3 3 0 0 1 2.16 0l4.96 1.9c.58.23.96.79.96 1.4v2.58a6 6 0 0 0-1-.66V4.97L11.6 6a5.5 5.5 0 0 0-4.1 1.73v-.4L2 4.97v6.34c0 .21.13.4.32.47l3.99 1.53q.25.72.68 1.34l-.07-.03-4.96-1.9a1.5 1.5 0 0 1-.96-1.4V4.68c0-.62.38-1.18.96-1.4zm1.8.93a2 2 0 0 0-1.44 0l-1.38.53 5.59 2.12 1.95-.83zM2.56 4.13 8 6.46l2.16-.93L4.5 3.38zM16 11.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-5.15 1.85 3-3a.5.5 0 0 0-.7-.7l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0" />
  </svg>
);

/** Fluent `box_checkmark_16_filled`. */
export const FluentRefPackageCheckFilledIcon = () => (
  <svg {...base}>
    <path d="m4.04 2.49 6.6 2.83L8 6.46 1.43 3.64q.22-.23.53-.35zm1.33-.52 1.55-.6a3 3 0 0 1 2.16 0l4.96 1.92q.31.12.53.35l-2.65 1.14zM15 4.55 11.6 6c1.3.02 2.47.5 3.4 1.26V4.55M7.5 7.33v.4a5.5 5.5 0 0 0-.51 6.92l-.07-.03-4.96-1.9a1.5 1.5 0 0 1-.96-1.4V4.54zM16 11.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-5.15 1.85 3-3a.5.5 0 0 0-.7-.7l-2.65 2.64-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0" />
  </svg>
);

/** Fluent `text_sort_ascending_16_regular`. */
export const FluentRefSortAlphaIcon = () => (
  <svg {...base}>
    <path d="M5.46 1.3a.5.5 0 0 0-.92 0l-2.5 6a.5.5 0 0 0 .92.4l.7-1.7h2.67l.7 1.7a.5.5 0 1 0 .93-.4zM4.08 5 5 2.8 5.92 5zM2.5 9.5c0-.28.22-.5.5-.5h3.5a.5.5 0 0 1 .41.79L3.96 14H6.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.4-.79L5.53 10H3a.5.5 0 0 1-.5-.5m10-8.5c.28 0 .5.22.5.5v11.8l1.15-1.15a.5.5 0 0 1 .7.7l-2 2a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L12 13.29V1.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_sort_ascending_16_filled`. */
export const FluentRefSortAlphaFilledIcon = () => (
  <svg {...base}>
    <path d="M5.2 1.5a.75.75 0 0 0-1.4 0L1.8 7a.75.75 0 1 0 1.4.5L3.4 7H5.6l.19.5A.75.75 0 1 0 7.2 7zm-1.27 4 .57-1.56.57 1.56zM2 9.75c0-.41.34-.75.75-.75h3.5a.75.75 0 0 1 .6 1.21L4.27 13.5h1.97a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.6-1.21l2.57-3.29H2.75A.75.75 0 0 1 2 9.75M12.25 1c.41 0 .75.34.75.75v10.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2c-.3.3-.77.3-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V1.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `incognito_16_regular`. */
export const FluentRefIncognitoIcon = () => (
  <svg {...base}>
    <path d="M12 8a3 3 0 1 1-2.96 3.5H6.96a3 3 0 1 1 0-1h2.08A3 3 0 0 1 12 8M4 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4M8 5.5a45 45 0 0 1 6.58.5.5.5 0 0 1-.16 1q-.26-.05-.5-.08A41 41 0 0 0 8 6.5a44 44 0 0 0-6.29.47L1.6 7a.5.5 0 0 1-.17-.98l.14-.03a28 28 0 0 1 1.81-.23A45 45 0 0 1 8 5.5M10.88 2c.57 0 1.1.32 1.34.83l.73 1.45a.5.5 0 0 1-.9.44l-.72-1.44a.5.5 0 0 0-.45-.28H5.12a.5.5 0 0 0-.45.28l-.72 1.44a.5.5 0 0 1-.9-.44l.73-1.45c.25-.5.77-.83 1.34-.83zm3.7 4" />
  </svg>
);

/** Fluent `incognito_16_filled`. */
export const FluentRefIncognitoFilledIcon = () => (
  <svg {...base}>
    <path d="M12 8a3 3 0 1 1-2.96 3.5H6.96a3 3 0 1 1 0-1h2.08A3 3 0 0 1 12 8M4 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-1.12-7c.57 0 1.09.32 1.34.83l1.53 3.06.3.04.4.05.13.03a.5.5 0 0 1-.16.98l-.13-.02a26 26 0 0 0-1.77-.22A44 44 0 0 0 8 6.5a44 44 0 0 0-6.29.47L1.6 7a.5.5 0 0 1-.17-.98l.14-.03.39-.05.3-.04 1.53-3.06c.25-.5.77-.83 1.34-.83z" />
  </svg>
);

/** Fluent `arrow_bidirectional_left_right_16_regular`. */
export const FluentRefMoveHorizontalIcon = () => (
  <svg {...base}>
    <path d="M2.15 8.85a.5.5 0 0 1 0-.7l3-3a.5.5 0 1 1 .7.7L3.71 8h8.58l-2.14-2.15a.5.5 0 0 1 .7-.7l3 3c.2.2.2.5 0 .7l-3 3a.5.5 0 0 1-.7-.7L12.29 9H3.71l2.14 2.15a.5.5 0 1 1-.7.7z" />
  </svg>
);

/** Fluent `arrow_bidirectional_left_right_16_filled`. */
export const FluentRefMoveHorizontalFilledIcon = () => (
  <svg {...base}>
    <path d="M6.03 5.22c.3.3.3.77 0 1.06L4.56 7.75h6.88L9.97 6.28a.75.75 0 0 1 1.06-1.06l2.75 2.75c.3.3.3.77 0 1.06l-2.75 2.75a.75.75 0 1 1-1.06-1.06l1.47-1.47H4.56l1.47 1.47a.75.75 0 1 1-1.06 1.06L2.22 9.03a.75.75 0 0 1 0-1.06l2.75-2.75c.3-.3.77-.3 1.06 0" />
  </svg>
);

/** Fluent `arrow_autofit_width_20_regular`. */
export const FluentRefUnfoldHorizontalIcon = () => (
  <svg {...base}>
    <path d="m16.37 15-1.18 1.14a.5.5 0 1 0 .7.72l1.88-1.82c.3-.3.3-.78 0-1.08l-1.88-1.82a.5.5 0 1 0-.7.72L16.38 14H12.5a.5.5 0 1 0 0 1zM15 3a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v4.5a.5.5 0 0 1-1 0V5c0-1.1.9-2 2-2zM4.81 16.14 3.63 15H7.5a.5.5 0 1 0 0-1H3.63l1.18-1.14a.5.5 0 0 0-.7-.72l-1.88 1.82c-.3.3-.3.79 0 1.08l1.89 1.82a.5.5 0 1 0 .69-.72" />
  </svg>
);

/** Fluent `arrow_autofit_width_20_filled`. */
export const FluentRefUnfoldHorizontalFilledIcon = () => (
  <svg {...base}>
    <path d="m15.5 15-.73.71a.75.75 0 1 0 1.04 1.08l1.89-1.82a1 1 0 0 0 0-1.44l-1.89-1.82a.75.75 0 0 0-1.04 1.08l.74.71h-2.76a.75.75 0 0 0 0 1.5zM15 3a2 2 0 0 1 2 2v4.25a.75.75 0 0 1-1.5 0V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v4.25a.75.75 0 0 1-1.5 0V5c0-1.1.9-2 2-2zM5.23 15.71l-.73-.7h2.75a.75.75 0 1 0 0-1.5H4.5l.73-.72a.75.75 0 0 0-1.04-1.08l-1.88 1.82a1 1 0 0 0 0 1.44l1.88 1.82a.75.75 0 0 0 1.04-1.08" />
  </svg>
);

/** Fluent `chat_checkmark_16_regular`. */
export const FluentRefChatCheckIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 1a6 6 0 0 0-5.07 9.2q.12.2.05.43l-.69 2.08 2.08-.7q.22-.06.42.06A6 6 0 1 0 8 2m2.15 4.15a.5.5 0 0 1 .7.7L7.6 10.1a.5.5 0 0 1-.7 0L5.15 8.35a.5.5 0 0 1 .7-.7l1.4 1.4z" />
  </svg>
);

/** Fluent `chat_checkmark_16_filled`. */
export const FluentRefChatCheckFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m2.85 5.15a.5.5 0 0 0-.7 0l-2.9 2.9-1.4-1.4a.5.5 0 0 0-.7.7L6.9 10.1c.2.2.5.2.7 0l3.25-3.25a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `text_bullet_list_dismiss_20_regular`. */
export const FluentRefListXIcon = () => (
  <svg {...base}>
    <path d="M3 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3-1c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4.02 5.5q.05-.51.19-1H6.5a.5.5 0 0 0 0 1zM4 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m17 5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-3.8 0 1.15-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7z" />
  </svg>
);

/** Fluent `text_bullet_list_dismiss_20_filled`. */
export const FluentRefListXFilledIcon = () => (
  <svg {...base}>
    <path d="M3.25 6a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M7 4.75c0-.41.34-.75.75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 4.75M7.75 9a.75.75 0 0 0 0 1.5h5.46a5.5 5.5 0 0 1 4.39-.09.75.75 0 0 0-.35-1.41zm0 5h2.46q-.21.72-.21 1.5H7.75a.75.75 0 0 1 0-1.5M4.5 9.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M3.25 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M20 15.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-3.8 0 1.15-1.15a.5.5 0 0 0-.7-.7l-1.15 1.14-1.15-1.14a.5.5 0 0 0-.7.7l1.14 1.15-1.14 1.15a.5.5 0 0 0 .7.7l1.15-1.14 1.15 1.14a.5.5 0 0 0 .7-.7z" />
  </svg>
);

/** Fluent `cellular_data_3_20_regular`. */
export const FluentRefSignalLowIcon = () => (
  <svg {...base}>
    <path d="M7.5 10a.5.5 0 0 1 .5.41v5.09a.5.5 0 0 1-.99.09V10.5c0-.28.22-.5.5-.5m-3 2a.5.5 0 0 1 .5.41v3.1a.5.5 0 0 1-1 .08V12.5c0-.28.22-.5.5-.5m6-4a.5.5 0 0 1 .5.4v7.1a.5.5 0 0 1-1 .09V8.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `cellular_data_3_20_filled`. */
export const FluentRefSignalLowFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 12c.38 0 .69.28.74.64l.01.11v2.5a.75.75 0 0 1-1.5.1v-2.6c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v4.5a.75.75 0 0 1-1.5.1v-4.6c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v6.5a.75.75 0 0 1-1.5.11V8.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `cellular_data_2_20_regular`. */
export const FluentRefSignalMediumIcon = () => (
  <svg {...base}>
    <path d="M7.5 10a.5.5 0 0 1 .5.41v5.09a.5.5 0 0 1-.99.09V10.5c0-.28.22-.5.5-.5m-3 2a.5.5 0 0 1 .5.41v3.09a.5.5 0 0 1-1 .09V12.5c0-.28.22-.5.5-.5m6-4a.5.5 0 0 1 .5.4v7.1a.5.5 0 0 1-1 .09V8.5c0-.28.22-.5.5-.5m3-2a.5.5 0 0 1 .5.41v9.09a.5.5 0 0 1-1 .09V6.5c0-.27.22-.5.5-.5" />
  </svg>
);

/** Fluent `cellular_data_2_20_filled`. */
export const FluentRefSignalMediumFilledIcon = () => (
  <svg {...base}>
    <path d="M4.75 12c.38 0 .69.28.74.64l.01.11v2.5a.75.75 0 0 1-1.5.1v-2.6c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64l.01.11v4.5a.75.75 0 0 1-1.5.1v-4.6c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64v6.61a.75.75 0 0 1-1.48.11l-.01-.11v-6.5c0-.41.34-.75.75-.75m3-2c.38 0 .69.28.74.64v8.61a.75.75 0 0 1-1.48.11l-.01-.11v-8.5c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `panel_bottom_expand_20_regular`. */
export const FluentRefPanelBottomOpenIcon = () => (
  <svg {...base}>
    <path d="m10.5 8.83.87 1a.5.5 0 0 0 .76-.66l-1.75-2a.5.5 0 0 0-.76 0l-1.75 2a.5.5 0 0 0 .76.65l.87-1v3.68a.5.5 0 0 0 1 0zM4 4a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5h-5.5v1H17v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2h5.5v-1H3z" />
  </svg>
);

/** Fluent `panel_bottom_expand_20_filled`. */
export const FluentRefPanelBottomOpenFilledIcon = () => (
  <svg {...base}>
    <path d="m10.5 8.83.87 1a.5.5 0 0 0 .76-.66l-1.75-2a.5.5 0 0 0-.76 0l-1.75 2a.5.5 0 0 0 .76.65l.87-1v3.68a.5.5 0 0 0 1 0zM4 4a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5h-5.5v1.5a1.5 1.5 0 1 1-3 0V11H3z" />
  </svg>
);

/** Fluent `panel_bottom_contract_20_regular`. */
export const FluentRefPanelBottomCloseIcon = () => (
  <svg {...base}>
    <path d="m10.5 11.17.87-1a.5.5 0 0 1 .76.66l-1.75 2a.5.5 0 0 1-.76 0l-1.75-2a.5.5 0 1 1 .76-.65l.87 1V7.5a.5.5 0 1 1 1 0zM4 4a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5h-3.83a2 2 0 0 1-.3.5l-.44.5H17v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2h4.57l-.45-.5a2 2 0 0 1-.29-.5H3z" />
  </svg>
);

/** Fluent `panel_bottom_contract_20_filled`. */
export const FluentRefPanelBottomCloseFilledIcon = () => (
  <svg {...base}>
    <path d="m10.5 11.17.87-1a.5.5 0 0 1 .76.66l-1.75 2a.5.5 0 0 1-.76 0l-1.75-2a.5.5 0 1 1 .76-.65l.87 1V7.5a.5.5 0 1 1 1 0zM4 4a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5h-3.83a2 2 0 0 1-.3.5l-1.74 2a1.5 1.5 0 0 1-2.26 0l-1.75-2a2 2 0 0 1-.29-.5H3z" />
  </svg>
);

/** Fluent `image_sparkle_16_regular`. */
export const FluentRefImageSparkleIcon = () => (
  <svg {...base}>
    <path d="m5.12.28-.35 1.07a2.2 2.2 0 0 1-1.4 1.4L2.3 3.1h-.02a.42.42 0 0 0 0 .8l1.07.35a2.2 2.2 0 0 1 1.4 1.4l.35 1.07a.42.42 0 0 0 .8 0l.35-1.07a2.2 2.2 0 0 1 1.4-1.4l1.07-.35a.42.42 0 0 0 0-.8l-1.07-.35a2.2 2.2 0 0 1-1.38-1.4L5.92.28a.42.42 0 0 0-.8 0M.22 8.21l.76-.25a1.6 1.6 0 0 0 1-1l.25-.76a.3.3 0 0 1 .57 0l.25.77a1.6 1.6 0 0 0 .98 1l.77.24a.3.3 0 0 1 0 .57l-.77.25a1.6 1.6 0 0 0-1 1l-.24.77a.3.3 0 0 1-.58 0l-.24-.77a1.6 1.6 0 0 0-1-1L.2 8.8a.3.3 0 0 1 0-.57zM3 11.91v.59A2.5 2.5 0 0 0 5.5 15h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 12.5 3H9.9a1.4 1.4 0 0 1 0 1h2.59c.83 0 1.5.67 1.5 1.5v7q0 .35-.15.65L10.2 9.49a1.7 1.7 0 0 0-2.4 0l-3.65 3.66A2 2 0 0 1 4 12.5v-2.19l-.02.04-.26.8q-.15.38-.48.62-.11.08-.24.13m8.5-4.4a1 1 0 1 0 0-2.01 1 1 0 0 0 0 2m-2 2.7 3.65 3.64q-.3.15-.65.15h-7a2 2 0 0 1-.65-.15L8.5 10.2a.7.7 0 0 1 1 0" />
  </svg>
);

/** Fluent `image_sparkle_16_filled`. */
export const FluentRefImageSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="m5.12.28-.35 1.07a2.2 2.2 0 0 1-1.4 1.4L2.3 3.1h-.02a.42.42 0 0 0 0 .8l1.07.35a2.2 2.2 0 0 1 1.4 1.4l.35 1.07a.42.42 0 0 0 .8 0l.35-1.07a2.2 2.2 0 0 1 1.4-1.4l1.07-.35a.42.42 0 0 0 0-.8l-1.07-.35a2.2 2.2 0 0 1-1.38-1.4L5.92.28a.42.42 0 0 0-.8 0M.22 8.21l.76-.25a1.6 1.6 0 0 0 1-1l.25-.76a.3.3 0 0 1 .57 0l.25.77a1.6 1.6 0 0 0 .98 1l.77.24a.3.3 0 0 1 0 .57l-.77.25a1.6 1.6 0 0 0-1 1l-.24.77a.3.3 0 0 1-.58 0l-.24-.77a1.6 1.6 0 0 0-1-1L.2 8.8a.3.3 0 0 1 0-.57zM3 11.91q.13-.06.24-.14.33-.24.48-.62l.26-.8a1 1 0 0 1 .14-.22 1 1 0 0 1 .22-.14l.77-.25q.4-.15.65-.48Q6 8.92 6 8.5q0-.29-.12-.55.23-.05.45-.2.4-.33.52-.7l.36-1.09q.13-.33.29-.47.26-.23.47-.3l1.06-.34A1.4 1.4 0 0 0 10 3.5q0-.27-.09-.5h2.59A2.5 2.5 0 0 1 15 5.5v7q-.01.77-.41 1.38L10.2 9.49a1.7 1.7 0 0 0-2.4 0L3.4 13.88q-.4-.6-.41-1.38zm8.5-4.4a1 1 0 1 0 0-2.01 1 1 0 0 0 0 2m-2 2.7 4.38 4.38q-.6.4-1.38.41h-7q-.77-.01-1.38-.41l4.39-4.39a.7.7 0 0 1 .99 0" />
  </svg>
);

/** Fluent `pen_sparkle_16_regular`. */
export const FluentRefPencilSparkleIcon = () => (
  <svg {...base}>
    <path d="m3.88.28.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.42.42 0 0 1 0 .8l-1.07.35a2.2 2.2 0 0 0-1.4 1.4L3.9 6.72a.42.42 0 0 1-.8 0l-.35-1.07a2.2 2.2 0 0 0-1.4-1.4L.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4L3.08.28a.42.42 0 0 1 .8 0m4.9 7.93-.76-.25a1.6 1.6 0 0 1-1-1l-.25-.76a.3.3 0 0 0-.57 0l-.25.77a1.6 1.6 0 0 1-.98 1l-.77.24a.3.3 0 0 0 0 .57l.77.25a1.6 1.6 0 0 1 1 1l.24.77a.3.3 0 0 0 .58 0l.24-.77a1.6 1.6 0 0 1 1-1l.77-.24a.3.3 0 0 0 0-.57zm-3.5 2.94q.03.1.09.19l-.32.32a1 1 0 0 0-.16.26l-.6 1.79 1.8-.6q.14-.04.25-.16l6.3-6.29.02-.03 1.07-1.07a.91.91 0 1 0-1.29-1.3L9.32 7.4l-.23-.1-.76-.26-.05-.02 3.45-3.45a1.91 1.91 0 0 1 2.71 2.7l-.73.74.26.26c.68.69.68 1.8 0 2.48l-1.12 1.11a.5.5 0 1 1-.7-.7l1.11-1.12c.3-.3.3-.77 0-1.06L13 7.71l-5.95 5.95q-.28.28-.65.4l-2.74.91a.5.5 0 0 1-.63-.63l.91-2.74q.13-.36.4-.65L5 10.3q0 .02.02.05z" />
  </svg>
);

/** Fluent `pen_sparkle_16_filled`. */
export const FluentRefPencilSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="m3.88.28.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.42.42 0 0 1 0 .8l-1.07.35a2.2 2.2 0 0 0-1.4 1.4L3.9 6.72a.42.42 0 0 1-.8 0l-.35-1.07a2.2 2.2 0 0 0-1.4-1.4L.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4L3.08.28a.42.42 0 0 1 .8 0m4.9 7.93-.76-.25a1.6 1.6 0 0 1-1-1l-.25-.76a.3.3 0 0 0-.57 0l-.25.77a1.6 1.6 0 0 1-.98 1l-.77.24a.3.3 0 0 0 0 .57l.77.25a1.6 1.6 0 0 1 1 1l.24.77a.3.3 0 0 0 .58 0l.24-.77a1.6 1.6 0 0 1 1-1l.77-.24a.3.3 0 0 0 0-.57zM6.5 12q-.41 0-.74-.23a1.4 1.4 0 0 1-.48-.62l-.26-.8L5 10.3l-.66.65q-.28.28-.4.65l-.91 2.74a.5.5 0 0 0 .63.63l2.74-.91q.36-.12.65-.4L13 7.71l.26.26c.3.3.3.77 0 1.06l-1.11 1.12a.5.5 0 0 0 .7.7l1.12-1.11c.68-.69.68-1.8 0-2.48L13.71 7l.73-.73a1.91 1.91 0 0 0-2.7-2.71L8.27 7.01l.05.02.76.25q.43.15.67.5a1.3 1.3 0 0 1-.63 1.97l-.8.26a1 1 0 0 0-.21.14 1 1 0 0 0-.14.23l-.25.76q-.15.41-.48.65c-.22.16-.48.2-.75.21" />
  </svg>
);

/** Fluent `text_bullet_list_square_sparkle_16_regular`. */
export const FluentRefTextSparkleIcon = () => (
  <svg {...base}>
    <path d="m10.88.28.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.42.42 0 0 1 0 .8l-1.07.35a2.2 2.2 0 0 0-1.4 1.4l-.35 1.07a.42.42 0 0 1-.8 0l-.35-1.07a2.2 2.2 0 0 0-1.4-1.4L7.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4l.35-1.07a.42.42 0 0 1 .8 0m4.9 7.93-.76-.25a1.6 1.6 0 0 1-1-1l-.25-.76a.3.3 0 0 0-.57 0l-.25.77a1.6 1.6 0 0 1-.98 1l-.77.24a.3.3 0 0 0 0 .57l.77.25a1.6 1.6 0 0 1 1 1l.24.77a.3.3 0 0 0 .58 0l.24-.77a1.6 1.6 0 0 1 1-1l.77-.24a.3.3 0 0 0 0-.57zM13.5 12q-.29 0-.55-.12A1.5 1.5 0 0 1 11.5 13h-7A1.5 1.5 0 0 1 3 11.5v-7C3 3.67 3.67 3 4.5 3h1.59a1.4 1.4 0 0 1 .86-.85L7.43 2H4.5A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.46-2.07q-.22.07-.46.07M9.67 7.74q-.15-.12-.25-.24H7a.5.5 0 0 0 0 1h3q0-.29.12-.55a1 1 0 0 1-.45-.2M4.75 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 10.5a.5.5 0 0 0 0 1h4.5a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_bullet_list_square_sparkle_16_filled`. */
export const FluentRefTextSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="m10.88.28.35 1.07a2.2 2.2 0 0 0 1.4 1.4l1.07.35h.02a.42.42 0 0 1 0 .8l-1.07.35a2.2 2.2 0 0 0-1.4 1.4l-.35 1.07a.42.42 0 0 1-.8 0l-.35-1.07a2.2 2.2 0 0 0-1.4-1.4L7.28 3.9a.42.42 0 0 1 0-.8l1.07-.35a2.2 2.2 0 0 0 1.38-1.4l.35-1.07a.42.42 0 0 1 .8 0m4.9 7.93-.76-.25a1.6 1.6 0 0 1-1-1l-.25-.76a.3.3 0 0 0-.57 0l-.25.77a1.6 1.6 0 0 1-.98 1l-.77.24a.3.3 0 0 0 0 .57l.77.25a1.6 1.6 0 0 1 1 1l.24.77a.3.3 0 0 0 .58 0l.24-.77a1.6 1.6 0 0 1 1-1l.77-.24a.3.3 0 0 0 0-.57zm-3.02 3.56a1.4 1.4 0 0 1-.48-.62l-.26-.8a1 1 0 0 0-.14-.22 1 1 0 0 0-.22-.14l-.77-.25q-.4-.15-.65-.48A1.3 1.3 0 0 1 10 8.5H7a.5.5 0 0 1 0-1h2.42q-.19-.22-.27-.45L8.8 5.96a1 1 0 0 0-.29-.47 1 1 0 0 0-.47-.3l-1.06-.34A1.4 1.4 0 0 1 6 3.5a1.4 1.4 0 0 1 .95-1.35L7.43 2H4.5A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.46-2.07q-.22.07-.46.07-.41 0-.74-.23M4.75 4.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m0 3a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5M5.5 11A.75.75 0 1 1 4 11a.75.75 0 0 1 1.5 0m1.5.5a.5.5 0 0 1 0-1h4.5a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `code_16_regular`. */
export const FluentRefCodeSparkleIcon = () => (
  <svg {...base}>
    <path d="M9.8 3.04c.26.12.37.41.26.66l-4 9a.5.5 0 0 1-.92-.4l4-9a.5.5 0 0 1 .66-.26M4.33 5.38c.2.18.23.5.04.7L2.67 8l1.7 1.92a.5.5 0 1 1-.74.66l-2-2.25a.5.5 0 0 1 0-.66l2-2.25a.5.5 0 0 1 .7-.04m7.34 0a.5.5 0 0 1 .7.04l2 2.25a.5.5 0 0 1 0 .66l-2 2.25a.5.5 0 1 1-.74-.66L13.33 8l-1.7-1.92a.5.5 0 0 1 .04-.7" />
  </svg>
);

/** Fluent `code_16_filled`. */
export const FluentRefCodeSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="M9.9 2.81c.38.17.55.62.39 1l-4 9a.75.75 0 1 1-1.38-.61l4-9a.75.75 0 0 1 1-.39M4.5 5.2c.3.27.34.75.06 1.06L3 8l1.56 1.75a.75.75 0 1 1-1.12 1l-2-2.25a.75.75 0 0 1 0-1l2-2.25A.75.75 0 0 1 4.5 5.2m7 0a.75.75 0 0 1 1.06.06l2 2.25c.25.29.25.71 0 1l-2 2.25a.75.75 0 0 1-1.12-1L13 8l-1.56-1.75a.75.75 0 0 1 .06-1.06" />
  </svg>
);

/** Fluent `people_team_16_regular`. */
export const FluentRefPeopleGroupIcon = () => (
  <svg {...base}>
    <path d="M6 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m3 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m1.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-9-1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M3 4.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M4.27 7A2 2 0 0 0 4 8H2v2.5a1.5 1.5 0 0 0 2.1 1.38q.11.5.34.94A2.5 2.5 0 0 1 1 10.5V8a1 1 0 0 1 1-1zm7.3 5.82A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.27A2 2 0 0 1 12 8h2v2.5a1.5 1.5 0 0 1-2.1 1.38q-.11.5-.34.94M6 7a1 1 0 0 0-1 1v3a3 3 0 0 0 6 0V8a1 1 0 0 0-1-1zm0 1h4v3a2 2 0 0 1-4 0z" />
  </svg>
);

/** Fluent `people_team_16_filled`. */
export const FluentRefPeopleGroupFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m4.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M5 8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a3 3 0 0 1-.15.93A3 3 0 0 1 5 11zM4 8q0-.55.27-1H2a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 0 3.44 2.32A4 4 0 0 1 4 11zm8 0v3q-.01.98-.44 1.82A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.27A2 2 0 0 1 12 8" />
  </svg>
);

/** Fluent `person_circle_16_regular`. */
export const FluentRefPersonDashedIcon = () => (
  <svg {...base}>
    <path d="M10 8.5c.83 0 1.5.67 1.5 1.5 0 1.25-1 2.5-3.5 2.5S4.5 11.25 4.5 10c0-.83.67-1.5 1.5-1.5zm-2-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `person_circle_16_filled`. */
export const FluentRefPersonDashedFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1M6 8.5c-.83 0-1.5.67-1.5 1.5 0 1.25 1 2.5 3.5 2.5s3.5-1.25 3.5-2.5c0-.83-.67-1.5-1.5-1.5zm2-5a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
  </svg>
);

/** Fluent `money_16_regular`. */
export const FluentRefCircleDollarIcon = () => (
  <svg {...base}>
    <path d="M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zM2.25 4a.25.25 0 0 0-.25.25V5h.5a.5.5 0 0 0 .5-.5V4zM2 9.75c0 .14.11.25.25.25H3v-.5a.5.5 0 0 0-.5-.5H2zm2-.25v.5h6v-.5c0-.83.67-1.5 1.5-1.5h.5V6h-.5A1.5 1.5 0 0 1 10 4.5V4H4v.5C4 5.33 3.33 6 2.5 6H2v2h.5C3.33 8 4 8.67 4 9.5m7 .5h.75q.23-.02.25-.25V9h-.5a.5.5 0 0 0-.5.5zm1-5v-.75a.25.25 0 0 0-.25-.25H11v.5c0 .28.22.5.5.5zm-7.5 8a1.5 1.5 0 0 1-1.43-1.04q.2.04.43.04h8.25C12.99 12 14 11 14 9.75V5.09c.58.2 1 .76 1 1.41v3.25c0 1.8-1.46 3.25-3.25 3.25z" />
  </svg>
);

/** Fluent `money_16_filled`. */
export const FluentRefCircleDollarFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zm3 .25V4H3v.5a.5.5 0 0 1-.5.5H2v1h.5C3.33 6 4 5.33 4 4.5M9 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0m2-3h-1v.5c0 .83.67 1.5 1.5 1.5h.5V5h-.5a.5.5 0 0 1-.5-.5zM4 9.5C4 8.67 3.33 8 2.5 8H2v1h.5c.28 0 .5.22.5.5v.5h1zm7 .5v-.5c0-.28.22-.5.5-.5h.5V8h-.5c-.83 0-1.5.67-1.5 1.5v.5zm-6.5 3a1.5 1.5 0 0 1-1.43-1.04q.2.04.43.04h8.25C12.99 12 14 11 14 9.75V5.09c.58.2 1 .76 1 1.41v3.25c0 1.8-1.46 3.25-3.25 3.25z" />
  </svg>
);

/** Fluent `comment_edit_16_regular`. */
export const FluentRefChatPenIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h9A2.5 2.5 0 0 1 15 4.5v.63q-.49-.15-1-.13v-.5c0-.83-.67-1.5-1.5-1.5h-9C2.67 3 2 3.67 2 4.5v5c0 .83.67 1.5 1.5 1.5H5v2.9l1.27-1.12-.21.87a2 2 0 0 0-.05.7l-.38.33A.98.98 0 0 1 4 13.94V12h-.5A2.5 2.5 0 0 1 1 9.5zm6.98 6.88 4.83-4.83a1.87 1.87 0 1 1 2.64 2.64l-4.83 4.83a2 2 0 0 1-1.02.58l-1.5.37a.9.9 0 0 1-1.07-1.07l.37-1.5q.15-.6.58-1.02" />
  </svg>
);

/** Fluent `comment_edit_16_filled`. */
export const FluentRefChatPenFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2A2.5 2.5 0 0 0 1 4.5v5A2.5 2.5 0 0 0 3.5 12H4v1.94c0 .84 1 1.3 1.63.74l.38-.34a2 2 0 0 1 .05-.69l.37-1.5a3 3 0 0 1 .84-1.48l4.83-4.83a2.9 2.9 0 0 1 2.9-.7V4.5A2.5 2.5 0 0 0 12.5 2zm4.48 9.38 4.83-4.83a1.87 1.87 0 1 1 2.64 2.64l-4.83 4.83a2 2 0 0 1-1.02.58l-1.5.37a.9.9 0 0 1-1.07-1.07l.37-1.5q.15-.6.58-1.02" />
  </svg>
);

/** Fluent `dark_theme_20_regular`. */
export const FluentRefSunMoonIcon = () => (
  <svg {...base}>
    <path d="M10 3a7 7 0 1 1 0 14zm0-1a8 8 0 1 0 0 16 8 8 0 0 0 0-16" />
  </svg>
);

/** Fluent `dark_theme_20_filled`. */
export const FluentRefSunMoonFilledIcon = () => (
  <svg {...base}>
    <path d="M10 3.5a6.5 6.5 0 1 1 0 13zM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16" />
  </svg>
);

/** Fluent `text_paragraph_direction_right_16_regular`. */
export const FluentRefPilcrowRightIcon = () => (
  <svg {...base}>
    <path d="M9 3a2.5 2.5 0 0 0 0 5h1V3zm2 0v10.5a.5.5 0 0 1-1 0V9H9a3.5 3.5 0 1 1 0-7h4.5a.5.5 0 0 1 0 1H13v10.5a.5.5 0 0 1-1 0V3zM2.15 6.15c.2-.2.5-.2.7 0l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 0 1-.7-.7L3.29 8 2.15 6.85a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `text_paragraph_direction_right_16_filled`. */
export const FluentRefPilcrowRightFilledIcon = () => (
  <svg {...base}>
    <path d="M11 13.5V3h1v10.5a.5.5 0 0 0 1 0V3h.5a.5.5 0 0 0 0-1H9a3.5 3.5 0 1 0 0 7h1v4.5a.5.5 0 0 0 1 0M2.85 6.15a.5.5 0 1 0-.7.7L3.29 8 2.15 9.15a.5.5 0 1 0 .7.7l1.5-1.5a.5.5 0 0 0 0-.7z" />
  </svg>
);

/** Fluent `text_paragraph_direction_left_16_regular`. */
export const FluentRefPilcrowLeftIcon = () => (
  <svg {...base}>
    <path d="M9 3a2.5 2.5 0 0 0 0 5h1V3zm2 0v10.5a.5.5 0 0 1-1 0V9H9a3.5 3.5 0 1 1 0-7h4.5a.5.5 0 0 1 0 1H13v10.5a.5.5 0 0 1-1 0V3zM3.85 6.15c.2.2.2.5 0 .7L2.71 8l1.14 1.15a.5.5 0 1 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `text_paragraph_direction_left_16_filled`. */
export const FluentRefPilcrowLeftFilledIcon = () => (
  <svg {...base}>
    <path d="M11 13.5V3h1v10.5a.5.5 0 0 0 1 0V3h.5a.5.5 0 0 0 0-1H9a3.5 3.5 0 1 0 0 7h1v4.5a.5.5 0 0 0 1 0M3.85 6.85a.5.5 0 1 0-.7-.7l-1.5 1.5a.5.5 0 0 0 0 .7l1.5 1.5a.5.5 0 0 0 .7-.7L2.71 8z" />
  </svg>
);

/** Fluent `database_16_regular`. */
export const FluentRefDatabaseIcon = () => (
  <svg {...base}>
    <path d="M8 1C5.15 1 3 2.08 3 3.5v9C3 13.93 5.15 15 8 15s5-1.07 5-2.5v-9C13 2.08 10.85 1 8 1m0 1c2.44 0 4 .89 4 1.5S10.44 5 8 5s-4-.89-4-1.5S5.56 2 8 2m0 12c-2.44 0-4-.89-4-1.5V5.02c1.21.7 2.6 1.04 4 .98 1.4.06 2.79-.28 4-.98v7.48c0 .61-1.56 1.5-4 1.5" />
  </svg>
);

/** Fluent `database_16_filled`. */
export const FluentRefDatabaseFilledIcon = () => (
  <svg {...base}>
    <path d="M13 3.5C13 4.88 10.76 6 8 6S3 4.88 3 3.5 5.24 1 8 1s5 1.12 5 2.5m-10 9V5.49C4.06 6.4 5.86 7 8 7s3.94-.59 5-1.51v7.01c0 1.43-2.15 2.5-5 2.5s-5-1.07-5-2.5" />
  </svg>
);

/** Fluent `server_16_regular`. */
export const FluentRefServerIcon = () => (
  <svg {...base}>
    <path d="M6.5 5h3a.5.5 0 1 0 0-1h-3a.5.5 0 1 0 0 1m3 6h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1m-3 2h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0 0 1M6 15h4a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2M5.3 2.3A1 1 0 0 1 6 2h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 .3-.7" />
  </svg>
);

/** Fluent `server_16_filled`. */
export const FluentRefServerFilledIcon = () => (
  <svg {...base}>
    <path d="M11.41 1.59A2 2 0 0 0 10 1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3a2 2 0 0 0-.59-1.41M9.85 12.85a.5.5 0 0 1-.35.15h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .35.85m0-2a.5.5 0 0 1-.35.15h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .35.85m0-6A.5.5 0 0 1 9.5 5h-3a.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .35.85" />
  </svg>
);

/** Fluent `cut_16_regular`. */
export const FluentRefScissorsIcon = () => (
  <svg {...base}>
    <path d="M11.78 1.08c.23.16.29.47.14.7L9.21 5.85l-.61-.91 2.48-3.72a.5.5 0 0 1 .7-.14m-.95 9.01q.32-.09.67-.09a2.5 2.5 0 1 1-1.57.55L8 7.65l-1.93 2.9a2.5 2.5 0 1 1-.9-.46l2.22-3.35-3.3-4.96a.5.5 0 0 1 .83-.56zM3 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m7 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0" />
  </svg>
);

/** Fluent `cut_16_filled`. */
export const FluentRefScissorsFilledIcon = () => (
  <svg {...base}>
    <path d="M10.84 9.53q.2-.03.41-.03a2.75 2.75 0 1 1-1.79.67L8 7.97l-1.46 2.2A2.74 2.74 0 0 1 4.75 15a2.75 2.75 0 1 1 .41-5.47l1.94-2.9-2.97-4.46a.75.75 0 1 1 1.24-.84zM3.5 12.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m6.5 0a1.25 1.25 0 1 0 .82-1.17h-.01l-.05.02c-.45.2-.76.63-.76 1.15m1.67-11.12c.34.23.43.7.2 1.04L9.8 5.27l-.9-1.35 1.73-2.59a.75.75 0 0 1 1.04-.2" />
  </svg>
);

/** Fluent `arrow_enter_16_regular`. */
export const FluentRefLogInIcon = () => (
  <svg {...base}>
    <path d="M6.5 2a.5.5 0 0 0 0 1h5c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-5a.5.5 0 0 0 0 1h5a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm3.35 5.65-3-3a.5.5 0 1 0-.7.7L8.29 7.5H1.5a.5.5 0 0 0 0 1h6.8l-2.15 2.15a.5.5 0 0 0 .7.7l3-3a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `arrow_enter_16_filled`. */
export const FluentRefLogInFilledIcon = () => (
  <svg {...base}>
    <path d="M6.75 1.5a.75.75 0 0 0 0 1.5h4.75c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5H6.75a.75.75 0 0 0 0 1.5h4.75a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm3.03 5.97-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H1.75a.75.75 0 0 0 0 1.5h5.69L6.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06" />
  </svg>
);

/** Fluent `arrow_exit_16_regular`. */
export const FluentRefLogOutIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h6a.5.5 0 0 0 0-1h-6A1.5 1.5 0 0 1 3 11.5v-7C3 3.67 3.67 3 4.5 3h6a.5.5 0 0 0 0-1zm7.35 2.65a.5.5 0 0 0-.7.7l2.14 2.15H6.5a.5.5 0 0 0 0 1h6.8l-2.15 2.15a.5.5 0 0 0 .7.7l3-3a.5.5 0 0 0 0-.7z" />
  </svg>
);

/** Fluent `arrow_exit_16_filled`. */
export const FluentRefLogOutFilledIcon = () => (
  <svg {...base}>
    <path d="M4.25 1.5A2.75 2.75 0 0 0 1.5 4.25v7.5a2.75 2.75 0 0 0 2.75 2.75h6a.75.75 0 0 0 0-1.5h-6C3.56 13 3 12.44 3 11.75v-7.5C3 3.56 3.56 3 4.25 3h6a.75.75 0 0 0 0-1.5zm7.78 3.22a.75.75 0 1 0-1.06 1.06l1.47 1.47H6.75a.75.75 0 0 0 0 1.5h5.69l-1.47 1.47a.75.75 0 1 0 1.06 1.06l2.75-2.75c.3-.3.3-.77 0-1.06z" />
  </svg>
);

/** Fluent `keyboard_16_regular`. */
export const FluentRefKeyboardIcon = () => (
  <svg {...base}>
    <path d="M3 10.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.25 7a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M10 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M6.25 7a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M13 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M5.25 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M9 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M1 4.75C1 3.78 1.78 3 2.75 3h10.5c.97 0 1.75.78 1.75 1.75v6.5c0 .97-.78 1.75-1.75 1.75H2.75C1.78 13 1 12.22 1 11.25zM2.75 4a.75.75 0 0 0-.75.75v6.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75v-6.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Fluent `keyboard_16_filled`. */
export const FluentRefKeyboardFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 3C1.78 3 1 3.78 1 4.75v6.5c0 .97.78 1.75 1.75 1.75h10.5c.97 0 1.75-.78 1.75-1.75v-6.5C15 3.78 14.22 3 13.25 3zM3 10.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.25 7a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M10 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M6.25 7a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M13 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M5.25 9a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5M9 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5" />
  </svg>
);

/** Fluent `cursor_16_regular`. */
export const FluentRefPointerIcon = () => (
  <svg {...base}>
    <path d="M4 3a1 1 0 0 1 1.6-.8l8 6A1 1 0 0 1 13 10H9.05a1 1 0 0 0-.79.4L5.8 13.6A1 1 0 0 1 4 13zm9 6L5 3v10l2.47-3.22A2 2 0 0 1 9.05 9z" />
  </svg>
);

/** Fluent `cursor_16_filled`. */
export const FluentRefPointerFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3a1 1 0 0 1 1.6-.8l8 6A1 1 0 0 1 13 10H9.05a1 1 0 0 0-.79.4L5.8 13.6A1 1 0 0 1 4 13z" />
  </svg>
);

/** Fluent `arrow_move_20_regular`. */
export const FluentRefMoveIcon = () => (
  <svg {...base20}>
    <path d="M10.35 2.15a.5.5 0 0 0-.7 0l-2.5 2.5a.5.5 0 1 0 .7.7L9.5 3.71V7.5a.5.5 0 0 0 1 0V3.7l1.65 1.65a.5.5 0 0 0 .7-.7zm-8.2 7.5a.5.5 0 0 0 0 .7l2.5 2.5a.5.5 0 0 0 .7-.7L3.71 10.5H7.5a.5.5 0 0 0 0-1H3.7l1.65-1.65a.5.5 0 1 0-.7-.7zM10 18a.5.5 0 0 1-.35-.15l-2.5-2.5a.5.5 0 0 1 .7-.7l1.65 1.64V12.5a.5.5 0 0 1 1 0v3.8l1.65-1.65a.5.5 0 0 1 .7.7l-2.5 2.5A.5.5 0 0 1 10 18m7.85-7.65a.5.5 0 0 0 0-.7l-2.5-2.5a.5.5 0 0 0-.7.7l1.64 1.65H12.5a.5.5 0 0 0 0 1h3.8l-1.65 1.65a.5.5 0 0 0 .7.7z" />
  </svg>
);

/** Fluent `arrow_move_20_filled`. */
export const FluentRefMoveFilledIcon = () => (
  <svg {...base20}>
    <path d="M10.53 2.22a.75.75 0 0 0-1.06 0L7.22 4.47a.75.75 0 0 0 1.06 1.06l.97-.97v2.69a.75.75 0 0 0 1.5 0V4.56l.97.97a.75.75 0 1 0 1.06-1.06zM2.22 9.47c-.3.3-.3.77 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-.97-.97h2.69a.75.75 0 0 0 0-1.5H4.56l.97-.97a.75.75 0 0 0-1.06-1.06zm8.31 8.31 2.25-2.25a.75.75 0 1 0-1.06-1.06l-.97.97v-2.69a.75.75 0 0 0-1.5 0v2.69l-.97-.97a.75.75 0 0 0-1.06 1.06l2.25 2.25c.3.3.77.3 1.06 0m5-10.56 2.25 2.25c.3.3.3.77 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97h-2.69a.75.75 0 0 1 0-1.5h2.69l-.97-.97a.75.75 0 0 1 1.06-1.06" />
  </svg>
);

/** Fluent `hourglass_16_regular`. */
export const FluentRefHourglassIcon = () => (
  <svg {...base}>
    <path d="M3 2.65C2.98 1.68 3.8 1 4.68 1h6.64c.88 0 1.7.68 1.68 1.65a5 5 0 0 1-.57 2.4 5 5 0 0 1-1.14 1.38l-.4.34-.15.11q-.25.2-.42.38a1 1 0 0 0 0 1.48 4 4 0 0 0 .57.5l.4.33c.4.34.81.76 1.14 1.38s.54 1.39.57 2.4c.02.97-.8 1.65-1.68 1.65H4.68c-.88 0-1.7-.68-1.68-1.65q.06-1.5.57-2.4c.33-.62.75-1.04 1.14-1.38l.4-.33.15-.12q.25-.2.42-.38a1 1 0 0 0 0-1.48 4 4 0 0 0-.57-.5l-.4-.33c-.4-.34-.82-.76-1.14-1.38A5 5 0 0 1 3 2.65M4.68 2c-.4 0-.69.3-.68.62.02.88.2 1.5.45 1.96s.57.8.91 1.1l.37.3.16.13q.27.21.52.47a2 2 0 0 1 0 2.84q-.24.26-.52.47l-.16.13-.37.3c-.34.3-.66.63-.9 1.1A4.3 4.3 0 0 0 4 13.38c0 .32.27.62.68.62h6.64c.4 0 .68-.3.68-.62-.03-.88-.21-1.5-.46-1.96-.24-.47-.56-.8-.9-1.1l-.37-.3-.17-.13q-.26-.21-.51-.47a2 2 0 0 1 0-2.84 5 5 0 0 1 .68-.6l.37-.3c.34-.3.66-.64.9-1.1.25-.46.44-1.08.46-1.96 0-.32-.28-.62-.68-.62z" />
  </svg>
);

/** Fluent `hourglass_16_filled`. */
export const FluentRefHourglassFilledIcon = () => (
  <svg {...base}>
    <path d="M5.34 4.11c-.13-.24-.26-.6-.31-1.11h5.94c-.05.52-.18.87-.3 1.11-.17.31-.4.55-.69.8l-.32.28-.19.15q-.28.22-.61.56A3 3 0 0 0 8 8a3 3 0 0 0-.86-2.1 6 6 0 0 0-.8-.71l-.32-.27c-.3-.26-.52-.5-.68-.8M10.97 13H5.03q.09-.77.3-1.11.26-.45.69-.8l.32-.28.19-.15q.28-.23.61-.56A3 3 0 0 0 8 8a3 3 0 0 0 .86 2.1 6 6 0 0 0 .8.71l.32.27q.45.37.68.8c.13.25.26.6.31 1.12" />
  </svg>
);

/** Fluent `spinner_ios_16_regular`. */
export const FluentRefLoaderIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 6 6 .5.5 0 0 0 0 1 7 7 0 1 0-7-7 .5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `spinner_ios_16_filled`. */
export const FluentRefLoaderFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 8A5.5 5.5 0 1 1 8 13.5.75.75 0 0 0 8 15a7 7 0 1 0-7-7 .75.75 0 0 0 1.5 0" />
  </svg>
);

/** Fluent `thumb_like_16_regular`. */
export const FluentRefThumbsUpIcon = () => (
  <svg {...base}>
    <path d="M8.03 1.92c.21-.52.8-1.08 1.55-.87.6.17.97.52 1.2 1 .2.44.25.96.26 1.46a8 8 0 0 1-.24 1.74q-.09.4-.19.74h1.38a2 2 0 0 1 1.92 2.56l-1.36 4.65a2.5 2.5 0 0 1-3.15 1.68L4.05 13.2A2 2 0 0 1 2.77 12l-.52-1.4a2 2 0 0 1 .86-2.42l1.87-1.1.02-.01.1-.09q.15-.1.4-.4c.35-.39.82-1.03 1.3-2.04.2-.44.37-.78.53-1.1.25-.5.46-.92.7-1.52m-2.51 6-.02.01-1.88 1.11a1 1 0 0 0-.43 1.22l.52 1.38a1 1 0 0 0 .64.6l5.35 1.68c.8.26 1.65-.2 1.89-1l1.36-4.65A1 1 0 0 0 12 6.99H9.93a.5.5 0 0 1-.48-.67c.1-.28.26-.77.38-1.3.13-.54.22-1.08.2-1.5q0-.68-.16-1.05a.8.8 0 0 0-.56-.45q-.06-.03-.16.03a.5.5 0 0 0-.19.25c-.25.63-.5 1.11-.76 1.65q-.24.45-.5 1.01a10 10 0 0 1-1.45 2.28 5 5 0 0 1-.7.66zm-.54-.84Z" />
  </svg>
);

/** Fluent `thumb_like_16_filled`. */
export const FluentRefThumbsUpFilledIcon = () => (
  <svg {...base}>
    <path d="M9.58 1.05c-.75-.2-1.34.35-1.55.87-.24.6-.45 1.02-.7 1.53q-.24.44-.53 1.09c-.48 1-.95 1.65-1.3 2.04a4 4 0 0 1-.5.49h-.02L3.11 8.19a2 2 0 0 0-.86 2.43l.52 1.38a2 2 0 0 0 1.28 1.2l5.35 1.69a2.5 2.5 0 0 0 3.15-1.68l1.36-4.65A2 2 0 0 0 12 6h-1.38l.2-.74c.13-.56.24-1.2.23-1.74-.01-.5-.06-1.02-.27-1.46q-.32-.73-1.19-1m-4.6 6.03Z" />
  </svg>
);

/** Fluent `emoji_16_regular`. */
export const FluentRefSmileIcon = () => (
  <svg {...base}>
    <path d="M6.25 7.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-.11 1.92a.5.5 0 1 0-.75.66 3.5 3.5 0 0 0 5.22 0 .5.5 0 0 0-.75-.66 2.5 2.5 0 0 1-3.72 0M10.5 7A.75.75 0 1 1 9 7a.75.75 0 0 1 1.5 0M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8" />
  </svg>
);

/** Fluent `emoji_16_filled`. */
export const FluentRefSmileFilledIcon = () => (
  <svg {...base}>
    <path d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12M6.25 7.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-.11 1.92a.5.5 0 1 0-.75.66 3.5 3.5 0 0 0 5.22 0 .5.5 0 1 0-.75-.66 2.5 2.5 0 0 1-3.72 0m3.61-1.92a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
  </svg>
);

/** Fluent `briefcase_16_regular`. */
export const FluentRefBriefcaseIcon = () => (
  <svg {...base}>
    <path d="M9.25 1c.97 0 1.75.78 1.75 1.75V4h1.5A2.5 2.5 0 0 1 15 6.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5v-5A2.5 2.5 0 0 1 3.5 4H5V2.75C5 1.78 5.78 1 6.75 1zM14 9.5q-.64.48-1.5.5H9v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V10H3.5q-.85-.02-1.5-.5v2c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5zM3.5 5C2.67 5 2 5.67 2 6.5v1C2 8.33 2.67 9 3.5 9H7v-.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5V9h3.5c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5zm3.25-3a.75.75 0 0 0-.75.75V4h4V2.75A.75.75 0 0 0 9.25 2z" />
  </svg>
);

/** Fluent `briefcase_16_filled`. */
export const FluentRefBriefcaseFilledIcon = () => (
  <svg {...base}>
    <path d="M15 11.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5V8.95A3.5 3.5 0 0 0 3.5 10H7v.5c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V10h3.5c.98 0 1.86-.4 2.5-1.05zM9.25 1c.97 0 1.75.78 1.75 1.75V4h1.5a2.5 2.5 0 0 1 0 5H9v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V9H3.5a2.5 2.5 0 0 1 0-5H5V2.75C5 1.78 5.78 1 6.75 1zm-2.5 1a.75.75 0 0 0-.75.75V4h4V2.75A.75.75 0 0 0 9.25 2z" />
  </svg>
);

/** Fluent `building_16_regular`. */
export const FluentRefBuildingIcon = () => (
  <svg {...base}>
    <path d="M6.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M7 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5 3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M9 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5 3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-5-8C4.67 2 4 2.67 4 3.5v10c0 .28.22.5.5.5h8a.5.5 0 0 0 .5-.5v-5c0-.83-.67-1.5-1.5-1.5H11V3.5c0-.83-.67-1.5-1.5-1.5zM5 3.5c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5v4c0 .28.22.5.5.5h1c.28 0 .5.22.5.5V13h-1v-1.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5V13H5zm5 8.5v1H9v-1zm-2 0v1H7v-1z" />
  </svg>
);

/** Fluent `building_16_filled`. */
export const FluentRefBuildingFilledIcon = () => (
  <svg {...base}>
    <path d="M5.5 2C4.67 2 4 2.67 4 3.5v10c0 .28.22.5.5.5H6v-2.5c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5V14h1.5a.5.5 0 0 0 .5-.5v-5c0-.83-.67-1.5-1.5-1.5H11V3.5c0-.83-.67-1.5-1.5-1.5zM7 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M7 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M9 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M10 14v-2H9v2zm-2 0v-2H7v2z" />
  </svg>
);

/** Fluent `compass_northwest_16_regular`. */
export const FluentRefCompassIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2M4.6 5.9a1 1 0 0 1 1.3-1.3l2.55 1.04a3.5 3.5 0 0 1 1.9 1.91l1.05 2.54a1 1 0 0 1-1.3 1.3l-2.55-1.04a3.5 3.5 0 0 1-1.9-1.9zm1.97 2.17c.26.61.75 1.1 1.36 1.36l2.55 1.04-1.05-2.54a2.5 2.5 0 0 0-1.36-1.36L5.53 5.52z" />
  </svg>
);

/** Fluent `compass_northwest_16_filled`. */
export const FluentRefCompassFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1M5.81 4.83a.75.75 0 0 0-.98.98l1.05 2.54c.33.8.97 1.44 1.77 1.77l2.54 1.05a.75.75 0 0 0 .98-.98l-1.05-2.54a3.3 3.3 0 0 0-1.77-1.78z" />
  </svg>
);

/** Fluent `crop_16_regular`. */
export const FluentRefCropIcon = () => (
  <svg {...base}>
    <path d="M5 1.5a.5.5 0 0 0-1 0V4H1.5a.5.5 0 0 0 0 1H4v4.5A2.5 2.5 0 0 0 6.5 12H11v2.5a.5.5 0 0 0 1 0V12h2.5a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 9.5zm6 5V10h1V6.5A2.5 2.5 0 0 0 9.5 4H6v1h3.5c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `crop_16_filled`. */
export const FluentRefCropFilledIcon = () => (
  <svg {...base}>
    <path d="M5 1.75a.75.75 0 0 0-1.5 0V3.5H1.75a.75.75 0 0 0 0 1.5H3.5v4.5a3 3 0 0 0 3 3H11v1.75a.75.75 0 0 0 1.5 0V12.5h1.75a.75.75 0 0 0 0-1.5H6.5A1.5 1.5 0 0 1 5 9.5zm6 4.75V10h1.5V6.5a3 3 0 0 0-3-3H6V5h3.5c.83 0 1.5.67 1.5 1.5" />
  </svg>
);

/** Fluent `trophy_16_regular`. */
export const FluentRefTrophyIcon = () => (
  <svg {...base}>
    <path d="M4 3c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2h.5c.83 0 1.5.67 1.5 1.5v1a2.5 2.5 0 0 1-2.12 2.47 4 4 0 0 1-3.38 3V12H10a2 2 0 0 1 2 2v.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V14c0-1.1.9-2 2-2h1.5v-1.03a4 4 0 0 1-3.38-3A2.5 2.5 0 0 1 2 5.5v-1C2 3.67 2.67 3 3.5 3zm7 0a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v4a3 3 0 0 0 6 .07zm1 3.91c.58-.2 1-.76 1-1.41v-1a.5.5 0 0 0-.5-.5H12zM4 4h-.5a.5.5 0 0 0-.5.5v1c0 .65.42 1.2 1 1.41zm1 10h6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1" />
  </svg>
);

/** Fluent `trophy_16_filled`. */
export const FluentRefTrophyFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3h-.5C2.67 3 2 3.67 2 4.5v1a2.5 2.5 0 0 0 2.12 2.47 4 4 0 0 0 3.38 3V12H6a2 2 0 0 0-2 2v.5c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5V14a2 2 0 0 0-2-2H8.5v-1.03a4 4 0 0 0 3.38-3A2.5 2.5 0 0 0 14 5.5v-1c0-.83-.67-1.5-1.5-1.5H12a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2m8 1h.5c.28 0 .5.22.5.5v1c0 .65-.42 1.2-1 1.41zM4 4v2.91c-.58-.2-1-.76-1-1.41v-1c0-.28.22-.5.5-.5z" />
  </svg>
);

/** Fluent `drink_coffee_16_regular`. */
export const FluentRefCoffeeIcon = () => (
  <svg {...base}>
    <path d="M2.5 0c.28 0 .5.22.5.5 0 .47.27.7.8 1.1l.04.03C4.31 1.98 5 2.5 5 3.5a.5.5 0 0 1-1 0c0-.47-.27-.7-.8-1.1l-.04-.03C2.69 2.02 2 1.5 2 .5c0-.28.22-.5.5-.5m3 0c.28 0 .5.22.5.5 0 .47.27.7.8 1.1l.04.03C7.31 1.98 8 2.5 8 3.5a.5.5 0 0 1-1 0c0-.47-.27-.7-.8-1.1l-.04-.03C5.69 2.02 5 1.5 5 .5c0-.28.22-.5.5-.5M9 .5a.5.5 0 0 0-1 0c0 1 .69 1.52 1.16 1.87l.04.03c.53.4.8.63.8 1.1a.5.5 0 0 0 1 0c0-1-.69-1.52-1.16-1.87L9.8 1.6C9.27 1.2 9 .97 9 .5M13 6h.5a2.5 2.5 0 0 1 0 5h-.7A5.5 5.5 0 0 1 2 9.5V5.9c0-.5.4-.9.9-.9h9.2c.5 0 .9.4.9.9zM3 6v3.5a4.5 4.5 0 1 0 9 0V6zm10 1v2.5q0 .26-.02.5h.52a1.5 1.5 0 0 0 0-3z" />
  </svg>
);

/** Fluent `drink_coffee_16_filled`. */
export const FluentRefCoffeeFilledIcon = () => (
  <svg {...base}>
    <path d="M3 .5a.5.5 0 0 0-1 0c0 1 .69 1.52 1.16 1.87l.04.03c.53.4.8.63.8 1.1a.5.5 0 0 0 1 0c0-1-.69-1.52-1.16-1.87L3.8 1.6C3.27 1.2 3 .97 3 .5m3 0a.5.5 0 0 0-1 0c0 1 .69 1.52 1.16 1.87l.04.03c.53.4.8.63.8 1.1a.5.5 0 0 0 1 0c0-1-.69-1.52-1.16-1.87L6.8 1.6C6.27 1.2 6 .97 6 .5M8.5 0c.28 0 .5.22.5.5 0 .47.27.7.8 1.1l.04.03c.47.35 1.16.87 1.16 1.87a.5.5 0 0 1-1 0c0-.47-.27-.7-.8-1.1l-.04-.03C8.69 2.02 8 1.5 8 .5c0-.28.22-.5.5-.5M2 5.9c0-.5.4-.9.9-.9h9.2c.5 0 .9.4.9.9V6h.5a2.5 2.5 0 0 1 0 5h-.7A5.5 5.5 0 0 1 2 9.5zM12.98 10h.52a1.5 1.5 0 0 0 0-3H13v2.5q0 .26-.02.5" />
  </svg>
);

/** Fluent `lock_closed_16_regular`. */
export const FluentRefLockIcon = () => (
  <svg {...base}>
    <path d="M8 1a3 3 0 0 1 3 3v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2V4a3 3 0 0 1 3-3M5 7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm3 2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2M8 2a2 2 0 0 0-2 2v2h4V4a2 2 0 0 0-2-2" />
  </svg>
);

/** Fluent `lock_closed_16_filled`. */
export const FluentRefLockFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a3 3 0 0 1 3 3v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2V4a3 3 0 0 1 3-3m0 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8 2a2 2 0 0 0-2 2v2h4V4a2 2 0 0 0-2-2" />
  </svg>
);

/** Fluent `star_16_regular`. */
export const FluentRefStarIcon = () => (
  <svg {...base}>
    <path d="M7.2 2.1a.9.9 0 0 1 1.6 0l1.53 3.08 3.4.5a.9.9 0 0 1 .5 1.53l-2.46 2.4.58 3.39a.9.9 0 0 1-1.3.95L8 12.35l-3.04 1.6a.9.9 0 0 1-1.3-.95l.57-3.39-2.46-2.4a.9.9 0 0 1 .5-1.53l3.4-.5zm.8.63L6.55 5.67a.9.9 0 0 1-.68.5l-3.25.47 2.35 2.3c.21.2.3.5.26.79l-.56 3.24 2.91-1.53a.9.9 0 0 1 .84 0l2.9 1.53-.55-3.24a.9.9 0 0 1 .26-.8l2.36-2.3-3.26-.46a.9.9 0 0 1-.67-.5z" />
  </svg>
);

/** Fluent `star_16_filled`. */
export const FluentRefStarFilledIcon = () => (
  <svg {...base}>
    <path d="M7.2 2.1a.9.9 0 0 1 1.6 0l1.53 3.08 3.4.5a.9.9 0 0 1 .5 1.53l-2.46 2.4.58 3.39a.9.9 0 0 1-1.3.95L8 12.35l-3.04 1.6a.9.9 0 0 1-1.3-.95l.57-3.39-2.46-2.4a.9.9 0 0 1 .5-1.53l3.4-.5z" />
  </svg>
);

/** Fluent `heart_16_regular`. */
export const FluentRefHeartIcon = () => (
  <svg {...base}>
    <path d="M7.54 3.95a3.25 3.25 0 0 0-4.6-.01 3.25 3.25 0 0 0 .02 4.6l4.7 4.7c.2.2.52.2.71 0l4.69-4.68a3.25 3.25 0 0 0-4.61-4.6l-.46.44zm4.8 3.9-4.32 4.33-4.36-4.36a2.25 2.25 0 0 1 0-3.18c.87-.87 2.3-.87 3.17.01l.81.81c.2.2.53.2.72 0l.79-.8c.88-.88 2.3-.87 3.19.01.88.88.88 2.3 0 3.18" />
  </svg>
);

/** Fluent `heart_16_filled`. */
export const FluentRefHeartFilledIcon = () => (
  <svg {...base}>
    <path d="M7.54 3.95a3.25 3.25 0 0 0-4.6-.01 3.25 3.25 0 0 0 .02 4.6l4.7 4.7c.2.2.52.2.71 0l4.69-4.68a3.25 3.25 0 0 0-4.61-4.6l-.46.44z" />
  </svg>
);

/** Fluent `calendar_ltr_16_regular`. */
export const FluentRefCalendarIcon = () => (
  <svg {...base}>
    <path d="M5.25 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6 10.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M8 9a.75.75 0 1 0 0-1.5A.75.75 0 0 0 8 9m.75 1.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2-1.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5zM3 6h10v5.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5zm1.5-3h7c.83 0 1.5.67 1.5 1.5V5H3v-.5C3 3.67 3.67 3 4.5 3" />
  </svg>
);

/** Fluent `calendar_ltr_16_filled`. */
export const FluentRefCalendarFilledIcon = () => (
  <svg {...base}>
    <path d="M14 11.5V6H2v5.5A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5M6 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m0 2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.75-2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m0 2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.75-2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V5h12z" />
  </svg>
);

/** Fluent `clock_16_regular`. */
export const FluentRefClockIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1m0 3.5a.5.5 0 0 0-1 0v4c0 .28.22.5.5.5h3a.5.5 0 0 0 0-1H8z" />
  </svg>
);

/** Fluent `clock_16_filled`. */
export const FluentRefClockFilledIcon = () => (
  <svg {...base}>
    <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M8 4.5V8h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0" />
  </svg>
);

/** Fluent `edit_16_regular`. */
export const FluentRefPencilIcon = () => (
  <svg {...base}>
    <path d="M14.24 1.76a2.6 2.6 0 0 0-3.71 0L2.66 9.64q-.57.57-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86q.78-.21 1.35-.78l7.88-7.87a2.6 2.6 0 0 0 0-3.7m-3 .71a1.62 1.62 0 1 1 2.29 2.3l-.78.77-2.3-2.29zM9.75 3.96l2.3 2.29-6.4 6.39q-.37.37-.89.5l-2.57.67.66-2.57q.14-.52.51-.9z" />
  </svg>
);

/** Fluent `edit_16_filled`. */
export const FluentRefPencilFilledIcon = () => (
  <svg {...base}>
    <path d="M10.53 1.76a2.62 2.62 0 1 1 3.7 3.71l-.77.78-3.71-3.7zM9.04 3.25 2.66 9.64q-.57.57-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86q.78-.21 1.35-.78l6.39-6.38z" />
  </svg>
);

/** Fluent `arrow_download_16_regular`. */
export const FluentRefDownloadIcon = () => (
  <svg {...base}>
    <path d="M3.5 13h9a.5.5 0 0 1 .09 1H3.5a.5.5 0 0 1-.09-1zh9zM7.91 1H8a.5.5 0 0 1 .5.41v8.89l2.68-2.69a.5.5 0 0 1 .64-.06l.07.06c.17.17.2.44.06.64l-.06.07-3.54 3.53a.5.5 0 0 1-.63.06l-.07-.06L4.1 8.32a.5.5 0 0 1 .64-.77l.07.06L7.5 10.3V1.5a.5.5 0 0 1 .41-.5H8z" />
  </svg>
);

/** Fluent `arrow_download_16_filled`. */
export const FluentRefDownloadFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 13h9a.75.75 0 0 1 .1 1.5H3.5a.75.75 0 0 1-.1-1.5zh9zM7.9 1H8c.38 0 .7.28.74.65l.01.1v7.69l2.26-2.26a.75.75 0 0 1 .97-.07l.09.07c.26.27.29.69.07.98l-.07.08-3.54 3.54a.75.75 0 0 1-.98.07l-.08-.07-3.54-3.54a.75.75 0 0 1 .98-1.13l.08.07 2.26 2.26V1.75c0-.38.28-.7.65-.74L8 1z" />
  </svg>
);

/** Fluent `arrow_upload_16_regular`. */
export const FluentRefUploadIcon = () => (
  <svg {...base}>
    <path d="M3.5 2a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm4.85 2.15a.5.5 0 0 0-.7 0l-3.5 3.5a.5.5 0 1 0 .7.7L7.5 5.71v7.79a.5.5 0 0 0 1 0V5.7l2.65 2.65a.5.5 0 0 0 .7-.7z" />
  </svg>
);

/** Fluent `arrow_upload_16_filled`. */
export const FluentRefUploadFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 2a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm4.78 2.72a.75.75 0 0 0-1.06 0L4.22 7.97a.75.75 0 0 0 1.06 1.06l1.97-1.97v6.19a.75.75 0 0 0 1.5 0V7.06l1.97 1.97a.75.75 0 1 0 1.06-1.06z" />
  </svg>
);

/** Fluent `filter_16_regular`. */
export const FluentRefFilterIcon = () => (
  <svg {...base}>
    <path d="M2 3.5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m2 4c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m2 4c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `filter_16_filled`. */
export const FluentRefFilterFilledIcon = () => (
  <svg {...base}>
    <path d="M1.75 3.75c0-.41.34-.75.75-.75h11a.75.75 0 0 1 0 1.5h-11a.75.75 0 0 1-.75-.75m2 4c0-.41.34-.75.75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75m2 4c0-.41.34-.75.75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75" />
  </svg>
);

/** Fluent `arrow_sort_16_regular`. */
export const FluentRefSortIcon = () => (
  <svg {...base}>
    <path d="M4.85 2.15a.5.5 0 0 0-.7 0l-3 3a.5.5 0 1 0 .7.7L4 3.71v9.79a.5.5 0 0 0 1 0V3.7l2.15 2.15a.5.5 0 1 0 .7-.7zm6.3 11.71c.2.19.5.19.7 0l3-2.9a.5.5 0 1 0-.7-.72L12 12.32V2.5a.5.5 0 0 0-1 0v9.82l-2.15-2.08a.5.5 0 1 0-.7.72z" />
  </svg>
);

/** Fluent `arrow_sort_16_filled`. */
export const FluentRefSortFilledIcon = () => (
  <svg {...base}>
    <path d="M10.73 13.79c.29.28.75.28 1.04 0l2.75-2.65a.75.75 0 1 0-1.04-1.08L12 11.49V2.75a.75.75 0 0 0-1.5 0v8.74l-1.48-1.43a.75.75 0 1 0-1.04 1.08zM5.28 2.22a.75.75 0 0 0-1.06 0L1.47 4.97a.75.75 0 0 0 1.06 1.06L4 4.56v8.69a.75.75 0 0 0 1.5 0V4.56l1.47 1.47a.75.75 0 0 0 1.06-1.06z" />
  </svg>
);

/** Fluent `sparkle_16_regular`. */
export const FluentRefSparkleIcon = () => (
  <svg {...base}>
    <path d="M5.47 9.83a.92.92 0 0 0 1.4-.46l.35-1.07A1.7 1.7 0 0 1 8.3 7.22l1.09-.35a.92.92 0 0 0-.04-1.75l-1.07-.35A1.7 1.7 0 0 1 7.2 3.7L6.85 2.6a.9.9 0 0 0-.87-.6q-.3 0-.53.16a1 1 0 0 0-.35.46l-.35 1.09A1.7 1.7 0 0 1 3.7 4.77l-1.08.36a.92.92 0 0 0 0 1.74l1.08.35A1.7 1.7 0 0 1 4.78 8.3l.35 1.08q.1.28.34.45M4 6.26 3.15 6l.87-.28A2.7 2.7 0 0 0 5.7 4l.26-.86.28.87a2.7 2.7 0 0 0 1.72 1.71l.88.27-.86.28a2.7 2.7 0 0 0-1.72 1.72l-.26.85-.28-.86A2.7 2.7 0 0 0 4 6.26m6.52 7.6q.21.14.47.14a.81.81 0 0 0 .76-.55l.25-.76a1.1 1.1 0 0 1 .68-.68l.77-.25a.8.8 0 0 0-.02-1.53l-.77-.25a1.1 1.1 0 0 1-.68-.67l-.25-.78A.8.8 0 0 0 11.1 8a.8.8 0 0 0-.88.54l-.25.77a1.1 1.1 0 0 1-.66.67l-.78.26a.8.8 0 0 0-.38 1.22q.15.21.4.3l.76.25a1.1 1.1 0 0 1 .68.68l.25.77q.09.25.3.4m-.91-2.8L9.44 11l.19-.06a2.1 2.1 0 0 0 1.3-1.32l.05-.18.06.18a2 2 0 0 0 1.32 1.32l.2.06-.18.06a2 2 0 0 0-1.32 1.32l-.06.18-.06-.18a2 2 0 0 0-1.32-1.32" />
  </svg>
);

/** Fluent `sparkle_16_filled`. */
export const FluentRefSparkleFilledIcon = () => (
  <svg {...base}>
    <path d="M5.47 9.83a.92.92 0 0 0 1.4-.46l.35-1.07A1.7 1.7 0 0 1 8.3 7.22l1.09-.35a.92.92 0 0 0-.04-1.75l-1.07-.35A1.7 1.7 0 0 1 7.2 3.7L6.85 2.6a.9.9 0 0 0-.87-.6q-.3 0-.53.16a1 1 0 0 0-.35.46l-.35 1.09A1.7 1.7 0 0 1 3.7 4.77l-1.08.36a.92.92 0 0 0 0 1.74l1.08.35A1.7 1.7 0 0 1 4.78 8.3l.35 1.08q.1.28.34.45m5.06 4.02q.21.15.47.15a.81.81 0 0 0 .76-.55l.25-.76a1.1 1.1 0 0 1 .68-.68l.77-.25a.8.8 0 0 0-.02-1.53l-.77-.25a1.1 1.1 0 0 1-.68-.67l-.25-.78A.8.8 0 0 0 11.1 8a.8.8 0 0 0-.88.54l-.25.77a1.1 1.1 0 0 1-.66.67l-.78.26a.8.8 0 0 0-.38 1.22q.15.21.4.3l.76.25a1.1 1.1 0 0 1 .68.68l.25.77q.09.25.3.4" />
  </svg>
);

/** Fluent `location_16_regular`. */
export const FluentRefLocationIcon = () => (
  <svg {...base}>
    <path d="M8 1a6 6 0 0 1 6 6c0 2.87-3.1 6.02-4.84 7.56-.67.59-1.65.59-2.32 0C5.1 13.02 2 9.87 2 7a6 6 0 0 1 6-6m0 1a5 5 0 0 0-5 5c0 1.1.61 2.4 1.57 3.68a21 21 0 0 0 2.93 3.13c.3.25.7.25 1 0 .84-.75 2-1.87 2.93-3.13C12.4 9.4 13 8.11 13 7a5 5 0 0 0-5-5m0 2.75a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5m0 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5" />
  </svg>
);

/** Fluent `location_16_filled`. */
export const FluentRefLocationFilledIcon = () => (
  <svg {...base}>
    <path d="M9.16 14.54C10.9 13.01 14 9.88 14 7A6 6 0 0 0 2 7c0 2.88 3.1 6.01 4.84 7.54.67.6 1.65.6 2.32 0M6 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
  </svg>
);

/** Fluent `subtract_16_regular`. */
export const FluentRefMinusIcon = () => (
  <svg {...base}>
    <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8" />
  </svg>
);

/** Fluent `subtract_16_filled`. */
export const FluentRefMinusFilledIcon = () => (
  <svg {...base}>
    <path d="M3 8c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8" />
  </svg>
);

/** Fluent `send_16_regular`. */
export const FluentRefSendIcon = () => (
  <svg {...base}>
    <path d="M1.18 1.12a.5.5 0 0 1 .54-.07l13 6.5a.5.5 0 0 1 0 .9l-13 6.5a.5.5 0 0 1-.7-.6L2.98 8 1.02 1.65a.5.5 0 0 1 .16-.53M3.87 8.5l-1.55 5.03L13.38 8 2.32 2.47 3.87 7.5H9.5a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `send_16_filled`. */
export const FluentRefSendFilledIcon = () => (
  <svg {...base}>
    <path d="M1.72 1.05a.5.5 0 0 0-.71.55l1.4 4.85q.1.29.4.35l5.69.95c.27.06.27.44 0 .5l-5.69.95a.5.5 0 0 0-.4.35l-1.4 4.85a.5.5 0 0 0 .71.55l13-6.5a.5.5 0 0 0 0-.9z" />
  </svg>
);

/** Fluent `arrow_clockwise_16_regular`. */
export const FluentRefRefreshIcon = () => (
  <svg {...base}>
    <path d="M3 8a5 5 0 0 1 9-3h-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.53A5.99 5.99 0 0 0 2 8a6 6 0 0 0 11.98.54.5.5 0 0 0-1-.08A5 5 0 0 1 3 8" />
  </svg>
);

/** Fluent `arrow_clockwise_16_filled`. */
export const FluentRefRefreshFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 8a4.5 4.5 0 0 1 7.85-3h-1.6a.75.75 0 0 0 0 1.5h3c.41 0 .75-.34.75-.75v-3a.75.75 0 0 0-1.5 0v.78a6 6 0 1 0 1.94 5.32.75.75 0 0 0-1.49-.2A4.5 4.5 0 0 1 3.5 8" />
  </svg>
);

/** Fluent `home_16_regular`. */
export const FluentRefHomeIcon = () => (
  <svg {...base}>
    <path d="M7.31 1.26a1 1 0 0 1 1.38 0l4.84 4.58c.3.28.47.68.47 1.1v5.56c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 9 12.5V10a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v2.5c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 2 12.5V6.93q.01-.63.47-1.09zM8 2 3.16 6.57a.5.5 0 0 0-.16.36v5.57c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5V10c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2.5c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5V6.93a.5.5 0 0 0-.16-.36z" />
  </svg>
);

/** Fluent `home_16_filled`. */
export const FluentRefHomeFilledIcon = () => (
  <svg {...base}>
    <path d="M8.69 1.26a1 1 0 0 0-1.38 0L2.47 5.84c-.3.28-.47.68-.47 1.1v5.56c0 .83.67 1.5 1.5 1.5H5c.83 0 1.5-.67 1.5-1.5V10c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2.5c0 .83.67 1.5 1.5 1.5h1.5c.83 0 1.5-.67 1.5-1.5V6.93q-.01-.63-.47-1.09z" />
  </svg>
);

/** Fluent `mail_16_regular`. */
export const FluentRefMailIcon = () => (
  <svg {...base}>
    <path d="M2 6.04V11c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM4 4h8a1 1 0 0 1 1 1v.74l-5 2.7-5-2.7V5a1 1 0 0 1 1-1M3 6.88l4.76 2.56a.5.5 0 0 0 .48 0L13 6.88V11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `mail_16_filled`. */
export const FluentRefMailFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3a2 2 0 0 0-2 2v.2l6 3.23 6-3.23V5a2 2 0 0 0-2-2zm10 3.34-5.76 3.1a.5.5 0 0 1-.48 0L2 6.34V11c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2z" />
  </svg>
);

/** Fluent `chat_16_regular`. */
export const FluentRefChatIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1m0 1a6 6 0 0 0-5.07 9.2q.12.2.05.43l-.69 2.08 2.08-.7q.23-.06.42.06A6 6 0 1 0 8 2m.5 7a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm2-3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `chat_16_filled`. */
export const FluentRefChatFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-3.54 13.04l-2.8.93a.5.5 0 0 1-.63-.63l.93-2.8A7 7 0 0 1 8 1M5.5 9a.5.5 0 0 0 0 1h3a.5.5 0 1 0 0-1zm0-3a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z" />
  </svg>
);

/** Fluent `image_16_regular`. */
export const FluentRefImageIcon = () => (
  <svg {...base}>
    <path d="M11.5 5.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v7q0 .35.15.65L6.8 8.49a1.7 1.7 0 0 1 2.4 0l3.65 3.66q.15-.3.15-.65v-7c0-.83-.67-1.5-1.5-1.5zm7.65 9.85L8.5 9.2a.7.7 0 0 0-1 0l-3.65 3.65q.3.15.65.15h7q.35 0 .65-.15" />
  </svg>
);

/** Fluent `image_16_filled`. */
export const FluentRefImageFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7q.01.77.41 1.38L6.8 8.49a1.7 1.7 0 0 1 2.4 0l4.39 4.39q.4-.6.41-1.38v-7A2.5 2.5 0 0 0 11.5 2zm7 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m1.38 8.09L8.5 9.2a.7.7 0 0 0-1 0L3.13 13.6q.6.4 1.38.41h7q.77-.01 1.38-.41" />
  </svg>
);

/** Fluent `mic_16_regular`. */
export const FluentRefMicIcon = () => (
  <svg {...base}>
    <path d="M5.5 4.5a2.5 2.5 0 0 1 5 0V8a2.5 2.5 0 0 1-5 0zM8 3c-.83 0-1.5.67-1.5 1.5V8a1.5 1.5 0 1 0 3 0V4.5C9.5 3.67 8.83 3 8 3M4 7.5c.28 0 .5.22.5.5a3.5 3.5 0 1 0 7 0 .5.5 0 0 1 1 0 4.5 4.5 0 0 1-4 4.47v1.03a.5.5 0 0 1-1 0v-1.03A4.5 4.5 0 0 1 3.5 8c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `mic_16_filled`. */
export const FluentRefMicFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a2.5 2.5 0 0 0-2.5 2.5V8a2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 8 2M4 7.5c.28 0 .5.22.5.5a3.5 3.5 0 1 0 7 0 .5.5 0 0 1 1 0 4.5 4.5 0 0 1-4 4.47v1.03a.5.5 0 0 1-1 0v-1.03A4.5 4.5 0 0 1 3.5 8c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `question_circle_16_regular`. */
export const FluentRefHelpIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2m0 8.5A.75.75 0 1 1 8 12a.75.75 0 0 1 0-1.5M8 4a2 2 0 0 1 1.67 3.09c-.17.25-.42.46-.57.6q-.26.24-.41.54c-.1.22-.19.53-.19 1.02a.5.5 0 0 1-1 0q0-.89.28-1.45c.18-.37.42-.62.62-.82.23-.22.35-.32.46-.47A1 1 0 0 0 9 6a1 1 0 0 0-2 0 .5.5 0 0 1-1 0c0-1.1.9-2 2-2" />
  </svg>
);

/** Fluent `question_circle_16_filled`. */
export const FluentRefHelpFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 10a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5m0-7a2 2 0 0 0-2 2 .5.5 0 0 0 1 0 1 1 0 0 1 2 0c0 .26-.06.4-.14.51-.1.15-.23.25-.46.47a2.8 2.8 0 0 0-.9 2.27.5.5 0 0 0 1 0c0-.49.08-.8.19-1.02q.15-.3.4-.53c.16-.15.4-.36.58-.61Q9.98 6.67 10 6a2 2 0 0 0-2-2" />
  </svg>
);

/** Fluent `bookmark_16_regular`. */
export const FluentRefBookmarkIcon = () => (
  <svg {...base}>
    <path d="M3.78 13.92A.5.5 0 0 1 3 13.5V4.01c0-1.1.9-2 2-2L11 2a2 2 0 0 1 2 2v9.5a.5.5 0 0 1-.78.42L8 11.1zM12 4v-.12A1 1 0 0 0 11 3l-6 .01a1 1 0 0 0-1 1v8.56l3.72-2.49a.5.5 0 0 1 .56 0L12 12.57z" />
  </svg>
);

/** Fluent `bookmark_16_filled`. */
export const FluentRefBookmarkFilledIcon = () => (
  <svg {...base}>
    <path d="M3.78 13.92A.5.5 0 0 1 3 13.5V4.01c0-1.1.9-2 2-2L11 2a2 2 0 0 1 2 2v9.5a.5.5 0 0 1-.78.42L8 11.1z" />
  </svg>
);

/** Fluent `navigation_16_regular`. */
export const FluentRefMenuIcon = () => (
  <svg {...base}>
    <path d="M2 3.5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `navigation_16_filled`. */
export const FluentRefMenuFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3.75c0-.41.34-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75m0 4c0-.41.34-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.75m0 4c0-.41.34-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75" />
  </svg>
);

/** Fluent `grid_16_regular`. */
export const FluentRefGridIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v2C2 6.33 2.67 7 3.5 7h2C6.33 7 7 6.33 7 5.5v-2C7 2.67 6.33 2 5.5 2zM3 3.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zM10.5 2C9.67 2 9 2.67 9 3.5v2c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zM10 3.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm-8 7C2 9.67 2.67 9 3.5 9h2c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-2A1.5 1.5 0 0 1 2 12.5zm1.5-.5a.5.5 0 0 0-.5.5v2c0 .28.22.5.5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm7-1C9.67 9 9 9.67 9 10.5v2c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zm-.5 1.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z" />
  </svg>
);

/** Fluent `grid_16_filled`. */
export const FluentRefGridFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v2C2 6.33 2.67 7 3.5 7h2C6.33 7 7 6.33 7 5.5v-2C7 2.67 6.33 2 5.5 2zm7 0C9.67 2 9 2.67 9 3.5v2c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zm-7 7C2.67 9 2 9.67 2 10.5v2c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2C7 9.67 6.33 9 5.5 9zm7 0C9.67 9 9 9.67 9 10.5v2c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `more_vertical_16_regular`. */
export const FluentRefMoreVerticalIcon = () => (
  <svg {...base}>
    <path d="M8 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-1 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

/** Fluent `more_vertical_16_filled`. */
export const FluentRefMoreVerticalFilledIcon = () => (
  <svg {...base}>
    <path d="M8 5.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m0 4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.75 12a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0" />
  </svg>
);

/** Fluent `play_16_regular`. */
export const FluentRefPlayIcon = () => (
  <svg {...base}>
    <path d="M5.75 3.06A.5.5 0 0 0 5 3.5v9c0 .38.41.62.75.44l8-4.5a.5.5 0 0 0 0-.88zM4 3.5a1.5 1.5 0 0 1 2.24-1.3l8 4.5a1.5 1.5 0 0 1 0 2.6l-8 4.5A1.5 1.5 0 0 1 4 12.5z" />
  </svg>
);

/** Fluent `play_16_filled`. */
export const FluentRefPlayFilledIcon = () => (
  <svg {...base}>
    <path d="M6.24 2.2A1.5 1.5 0 0 0 4 3.5v9a1.5 1.5 0 0 0 2.24 1.3l8-4.5a1.5 1.5 0 0 0 0-2.6z" />
  </svg>
);

/** Fluent `pause_16_regular`. */
export const FluentRefPauseIcon = () => (
  <svg {...base}>
    <path d="M3.75 2C2.78 2 2 2.78 2 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5C6.22 14 7 13.22 7 12.25v-8.5C7 2.78 6.22 2 5.25 2zM3 3.75c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v8.5c0 .41-.34.75-.75.75h-1.5a.75.75 0 0 1-.75-.75zM10.75 2C9.78 2 9 2.78 9 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5c.97 0 1.75-.78 1.75-1.75v-8.5C14 2.78 13.22 2 12.25 2zM10 3.75c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v8.5c0 .41-.34.75-.75.75h-1.5a.75.75 0 0 1-.75-.75z" />
  </svg>
);

/** Fluent `pause_16_filled`. */
export const FluentRefPauseFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 2C2.78 2 2 2.78 2 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5C6.22 14 7 13.22 7 12.25v-8.5C7 2.78 6.22 2 5.25 2zm7 0C9.78 2 9 2.78 9 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5c.97 0 1.75-.78 1.75-1.75v-8.5C14 2.78 13.22 2 12.25 2z" />
  </svg>
);

/** Fluent `arrow_undo_16_regular`. */
export const FluentRefUndoIcon = () => (
  <svg {...base}>
    <path d="M3 2.5a.5.5 0 0 1 1 0v3.84l3.17-3.17a4 4 0 0 1 5.66 5.66L7.8 13.85a.5.5 0 0 1-.7-.7l5.02-5.03a3 3 0 1 0-4.24-4.24L4.76 7H8.5a.5.5 0 0 1 0 1H3.6a.6.6 0 0 1-.6-.6z" />
  </svg>
);

/** Fluent `arrow_undo_16_filled`. */
export const FluentRefUndoFilledIcon = () => (
  <svg {...base}>
    <path d="M3 2.75a.75.75 0 0 1 1.5 0v3.1l2.67-2.68a4 4 0 0 1 5.66 5.66l-4.95 4.95a.75.75 0 1 1-1.06-1.06l4.95-4.95a2.5 2.5 0 0 0-3.54-3.54L5.97 6.5h2.28a.75.75 0 0 1 0 1.5h-4.4A.85.85 0 0 1 3 7.15z" />
  </svg>
);

/** Fluent `arrow_redo_16_regular`. */
export const FluentRefRedoIcon = () => (
  <svg {...base}>
    <path d="M13 2.5a.5.5 0 0 0-1 0v3.84L8.83 3.17a4 4 0 0 0-5.66 5.66l5.03 5.02a.5.5 0 0 0 .7-.7L3.88 8.12a3 3 0 0 1 4.24-4.24L11.24 7H7.5a.5.5 0 0 0 0 1h4.9a.6.6 0 0 0 .6-.6z" />
  </svg>
);

/** Fluent `arrow_redo_16_filled`. */
export const FluentRefRedoFilledIcon = () => (
  <svg {...base}>
    <path d="M13 2.75a.75.75 0 0 0-1.5 0v3.1L8.83 3.16a4 4 0 0 0-5.66 5.66l4.95 4.95a.75.75 0 1 0 1.06-1.06L4.23 7.77a2.5 2.5 0 0 1 3.54-3.54l2.27 2.27H7.75a.75.75 0 0 0 0 1.5h4.4c.47 0 .85-.38.85-.85z" />
  </svg>
);

/** Fluent `weather_sunny_16_regular`. */
export const FluentRefSunIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4m6.5-1.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM8 13c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5M2.5 8.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zm.65-5.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 9.7a.5.5 0 1 1-.7-.7l1-1a.5.5 0 0 1 .7.7zm9-9.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 9.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `weather_sunny_16_filled`. */
export const FluentRefSunFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.5-2.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM8 13c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5M2.5 8.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zm.65-5.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 9.7a.5.5 0 1 1-.7-.7l1-1a.5.5 0 0 1 .7.7zm9-9.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 9.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `weather_moon_16_regular`. */
export const FluentRefMoonIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-6.46 9.7A.5.5 0 0 1 2 10a6 6 0 0 0 5.53-8.3A.5.5 0 0 1 8 1m.72 1.04a7 7 0 0 1-5.94 8.92 6 6 0 1 0 5.94-8.92" />
  </svg>
);

/** Fluent `weather_moon_16_filled`. */
export const FluentRefMoonFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1-6.46 9.7A.5.5 0 0 1 2 10a6 6 0 0 0 5.53-8.3A.5.5 0 0 1 8 1" />
  </svg>
);

/** Fluent `desktop_16_regular`. */
export const FluentRefDesktopIcon = () => (
  <svg {...base}>
    <path d="M4 2a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h2v1H4.5a.5.5 0 0 0 0 1h7a.5.5 0 1 0 0-1H10v-1h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm5 10v1H7v-1zM3 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </svg>
);

/** Fluent `desktop_16_filled`. */
export const FluentRefDesktopFilledIcon = () => (
  <svg {...base}>
    <path d="M3.5 2C2.67 2 2 2.67 2 3.5v7c0 .83.67 1.5 1.5 1.5H6v1H4.5a.5.5 0 0 0 0 1h7a.5.5 0 1 0 0-1H10v-1h2.5c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM9 12v1H7v-1z" />
  </svg>
);

/** Fluent `code_16_regular`. */
export const FluentRefCodeIcon = () => (
  <svg {...base}>
    <path d="M9.8 3.04c.26.12.37.41.26.66l-4 9a.5.5 0 0 1-.92-.4l4-9a.5.5 0 0 1 .66-.26M4.33 5.38c.2.18.23.5.04.7L2.67 8l1.7 1.92a.5.5 0 1 1-.74.66l-2-2.25a.5.5 0 0 1 0-.66l2-2.25a.5.5 0 0 1 .7-.04m7.34 0a.5.5 0 0 1 .7.04l2 2.25a.5.5 0 0 1 0 .66l-2 2.25a.5.5 0 1 1-.74-.66L13.33 8l-1.7-1.92a.5.5 0 0 1 .04-.7" />
  </svg>
);

/** Fluent `code_16_filled`. */
export const FluentRefCodeFilledIcon = () => (
  <svg {...base}>
    <path d="M9.9 2.81c.38.17.55.62.39 1l-4 9a.75.75 0 1 1-1.38-.61l4-9a.75.75 0 0 1 1-.39M4.5 5.2c.3.27.34.75.06 1.06L3 8l1.56 1.75a.75.75 0 1 1-1.12 1l-2-2.25a.75.75 0 0 1 0-1l2-2.25A.75.75 0 0 1 4.5 5.2m7 0a.75.75 0 0 1 1.06.06l2 2.25c.25.29.25.71 0 1l-2 2.25a.75.75 0 0 1-1.12-1L13 8l-1.56-1.75a.75.75 0 0 1 .06-1.06" />
  </svg>
);

/** Fluent `code_block_16_regular`. */
export const FluentRefTerminalIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM3 4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5zm6.85 1.15a.5.5 0 1 0-.7.7L10.79 8 9.15 9.65a.5.5 0 0 0 .7.7l2-2a.5.5 0 0 0 0-.7zm-3 .7a.5.5 0 0 0-.7-.7l-2 2a.5.5 0 0 0 0 .7l2 2a.5.5 0 0 0 .7-.7L5.21 8z" />
  </svg>
);

/** Fluent `code_block_16_filled`. */
export const FluentRefTerminalFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zm5.35 3.65 2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7-.7L10.79 8 9.15 6.35a.5.5 0 1 1 .7-.7m-3 .7L5.21 8l1.64 1.65a.5.5 0 0 1-.7.7l-2-2a.5.5 0 0 1 0-.7l2-2a.5.5 0 0 1 .7.7" />
  </svg>
);

/** Fluent `dismiss_circle_16_regular`. */
export const FluentRefErrorIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1M6.35 5.65a.5.5 0 1 0-.7.7L7.29 8 5.65 9.65a.5.5 0 0 0 .7.7L8 8.71l1.65 1.64a.5.5 0 0 0 .7-.7L8.71 8l1.64-1.65a.5.5 0 0 0-.7-.7L8 7.29z" />
  </svg>
);

/** Fluent `dismiss_circle_16_filled`. */
export const FluentRefErrorFilledIcon = () => (
  <svg {...base}>
    <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M6.35 5.65 8 7.29l1.65-1.64a.5.5 0 0 1 .7.7L8.71 8l1.64 1.65a.5.5 0 0 1-.7.7L8 8.71l-1.65 1.64a.5.5 0 0 1-.7-.7L7.29 8 5.65 6.35a.5.5 0 1 1 .7-.7" />
  </svg>
);

/** Fluent `lock_open_16_regular`. */
export const FluentRefUnlockIcon = () => (
  <svg {...base}>
    <path d="M12 1a3 3 0 0 1 3 3v.5a.5.5 0 0 1-1 0V4a2 2 0 1 0-4 0v2h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4V4a3 3 0 0 1 3-3M5 7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm3 2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
  </svg>
);

/** Fluent `lock_open_16_filled`. */
export const FluentRefUnlockFilledIcon = () => (
  <svg {...base}>
    <path d="M12 1a3 3 0 0 1 3 3v.5a.5.5 0 0 1-1 0V4a2 2 0 1 0-4 0v2h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4V4a3 3 0 0 1 3-3M8 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `share_16_regular`. */
export const FluentRefShareIcon = () => (
  <svg {...base}>
    <path d="M7.5 2a.5.5 0 0 1 0 1h-3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-2a.5.5 0 0 1 1 0v2a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm3.28-.95a.5.5 0 0 1 .53.06l4.5 3.5a.5.5 0 0 1 0 .78l-4.5 3.5a.5.5 0 0 1-.81-.39V7.03c-2.23.23-3.62 1.97-4.4 3.4l-.15.3A.5.5 0 0 1 5 10.5a8.8 8.8 0 0 1 1.54-5.3 5.4 5.4 0 0 1 3.96-2.18V1.5q0-.31.28-.45m.72 2.45a.5.5 0 0 1-.5.5 4.4 4.4 0 0 0-3.66 1.8 7 7 0 0 0-1.15 2.68A6 6 0 0 1 11 6c.28 0 .5.22.5.5v.98L14.69 5 11.5 2.52z" />
  </svg>
);

/** Fluent `share_16_filled`. */
export const FluentRefShareFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 2a.5.5 0 0 1 0 1h-3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-2a.5.5 0 0 1 1 0v2a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2zm3.28-.95a.5.5 0 0 1 .53.06l4.5 3.5a.5.5 0 0 1 0 .78l-4.5 3.5a.5.5 0 0 1-.81-.39V7.03c-2.23.23-3.62 1.97-4.4 3.4l-.15.3A.5.5 0 0 1 5 10.5a8.8 8.8 0 0 1 1.54-5.3 5.4 5.4 0 0 1 3.96-2.18V1.5q0-.31.28-.45" />
  </svg>
);

/** Fluent `globe_16_regular`. */
export const FluentRefGlobeIcon = () => (
  <svg {...base}>
    <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12M8 3c.37 0 .88.36 1.31 1.32q.14.3.26.68H6.43q.12-.37.26-.68C7.12 3.36 7.63 3 8 3m-2.22.9q-.23.5-.4 1.1H4a5 5 0 0 1 2.04-1.6q-.14.24-.26.5M5.16 6a12 12 0 0 0 0 4H3.42a5 5 0 0 1 0-4zm.22 5a8 8 0 0 0 .66 1.6A5 5 0 0 1 4 11zm1.05 0h3.14a6 6 0 0 1-.26.68C8.88 12.64 8.37 13 8 13s-.88-.36-1.31-1.32a6 6 0 0 1-.26-.68m3.4-1H6.17a11 11 0 0 1 0-4h3.64a11 11 0 0 1 0 4m.79 1H12a5 5 0 0 1-2.04 1.6q.15-.24.26-.5.23-.5.4-1.1m1.96-1h-1.74a12 12 0 0 0 0-4h1.74a5 5 0 0 1 0 4M9.96 3.4c.81.35 1.52.9 2.04 1.6h-1.38a8 8 0 0 0-.66-1.6" />
  </svg>
);

/** Fluent `globe_16_filled`. */
export const FluentRefGlobeFilledIcon = () => (
  <svg {...base}>
    <path d="M6 8q0-1.06.12-2h3.76a16 16 0 0 1 0 4H6.12Q6 9.06 6 8m-.88 2a17 17 0 0 1 0-4H2.34a6 6 0 0 0 0 4zM2.8 11h2.47q.2.99.5 1.78.2.53.45.95A6 6 0 0 1 2.8 11m3.5 0h3.4q-.15.8-.4 1.42-.32.83-.7 1.23c-.24.27-.44.35-.6.35s-.36-.08-.6-.35a4 4 0 0 1-.7-1.23q-.25-.63-.4-1.42m4.43 0q-.2.99-.5 1.78-.2.53-.45.95A6 6 0 0 0 13.2 11zm2.93-1a6 6 0 0 0 0-4h-2.78a17 17 0 0 1 0 4zM9.3 3.58q.25.63.4 1.42H6.3q.15-.8.4-1.42.32-.83.7-1.23c.24-.27.44-.35.6-.35s.36.08.6.35q.38.4.7 1.23M10.73 5h2.47a6 6 0 0 0-3.42-2.73q.26.42.45.95.3.8.5 1.78M2.8 5h2.47q.2-.99.5-1.78.2-.52.45-.95A6 6 0 0 0 2.8 5" />
  </svg>
);

/** Fluent `attach_16_regular`. */
export const FluentRefAttachIcon = () => (
  <svg {...base}>
    <path d="M2.28 7.98a.5.5 0 0 0 .86.35l4.6-4.6A2.5 2.5 0 0 1 12 5.5a2.5 2.5 0 0 1-.73 1.77l-5.3 5.3a1 1 0 0 1-1.71-.7 1 1 0 0 1 .3-.71l5.3-5.3a.5.5 0 0 0-.7-.7l-5.32 5.29a2 2 0 1 0 2.83 2.83l5.3-5.3A3.49 3.49 0 0 0 9.5 2c-.9 0-1.8.34-2.48 1.02l-4.6 4.6a.5.5 0 0 0-.14.35" />
  </svg>
);

/** Fluent `attach_16_filled`. */
export const FluentRefAttachFilledIcon = () => (
  <svg {...base}>
    <path d="M9.5 1.75c-1 0-1.94.39-2.65 1.1l-4.6 4.6A.75.75 0 0 0 3.31 8.5l4.6-4.6a2.25 2.25 0 0 1 3.18 3.18l-5.3 5.3a.75.75 0 0 1-1.06-1.06l5.3-5.3a.75.75 0 0 0-1.06-1.06l-5.3 5.3a2.25 2.25 0 1 0 3.18 3.18l5.3-5.3a3.75 3.75 0 0 0-2.65-6.4" />
  </svg>
);

/** Fluent `tag_16_regular`. */
export const FluentRefTagIcon = () => (
  <svg {...base}>
    <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-8.41 4.14a2 2 0 0 1 0-2.83L7.33 2.6c.37-.37.88-.58 1.4-.59L12 2A2 2 0 0 1 14 4l-.02 3.37c0 .53-.22 1.03-.6 1.4l-4.66 4.65c-.78.77-2.05.77-2.84 0zm.7-2.12a1 1 0 0 0 0 1.41l3.3 3.28a1 1 0 0 0 1.42 0l4.67-4.65a1 1 0 0 0 .3-.7L13 4a1 1 0 0 0-1-1L8.73 3a1 1 0 0 0-.7.3z" />
  </svg>
);

/** Fluent `tag_16_filled`. */
export const FluentRefTagFilledIcon = () => (
  <svg {...base}>
    <path d="M2.59 7.31a2 2 0 0 0 0 2.83l3.3 3.28c.78.77 2.05.77 2.83 0l4.67-4.65c.37-.37.58-.87.59-1.4L14 4.01A2 2 0 0 0 11.99 2l-3.25.01c-.53 0-1.04.22-1.41.59zM11 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
  </svg>
);

/** Fluent `people_16_regular`. */
export const FluentRefPeopleIcon = () => (
  <svg {...base}>
    <path d="M7.5 9a2 2 0 0 1 2 2c0 .97-.6 1.73-1.41 2.23-.82.5-1.91.77-3.09.77a6 6 0 0 1-3.09-.77C1.1 12.73.5 11.97.5 11c0-1.1.9-2 2-2zm-5 1a1 1 0 0 0-1 1c0 .5.3 1 .93 1.38S3.97 13 5 13s1.94-.24 2.57-.62q.94-.6.93-1.38a1 1 0 0 0-1-1zm11.65-1a1.5 1.5 0 0 1 1.35 1.5c0 .77-.47 1.4-1.1 1.83-.64.42-1.49.67-2.4.67a5 5 0 0 1-1.92-.4q.24-.43.35-.95.66.33 1.57.35c.74 0 1.4-.2 1.84-.5.46-.3.66-.67.66-1a.5.5 0 0 0-.4-.49L14 10h-3.67a3 3 0 0 0-.58-.98L10 9h4.15m-1.92-5.5a2.25 2.25 0 0 1 2.02 2.25v.23A2.25 2.25 0 0 1 12 8L11.77 8a2.25 2.25 0 0 1-2-2.01l-.02-.23c0-1.24 1-2.25 2.25-2.25zM5 2.5A2.75 2.75 0 1 1 5 8a2.75 2.75 0 0 1 0-5.5m7 2A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0-2.5m-7-1A1.75 1.75 0 1 0 5 7a1.75 1.75 0 0 0 0-3.5" />
  </svg>
);

/** Fluent `people_16_filled`. */
export const FluentRefPeopleFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 9a2 2 0 0 1 2 2c0 .97-.6 1.73-1.41 2.23-.82.5-1.91.77-3.09.77a6 6 0 0 1-3.09-.77C1.1 12.73.5 11.97.5 11c0-1.1.9-2 2-2zm6.65 0a1.5 1.5 0 0 1 1.35 1.5c0 .77-.47 1.4-1.1 1.83-.64.42-1.49.67-2.4.67a5 5 0 0 1-1.92-.4q.4-.7.42-1.6c0-.76-.29-1.45-.75-1.98L10 9h4.15M5 2.5A2.75 2.75 0 1 1 5 8a2.75 2.75 0 0 1 0-5.5m7 1A2.25 2.25 0 1 1 12 8a2.25 2.25 0 0 1 0-4.5" />
  </svg>
);

/** Fluent `zoom_in_16_regular`. */
export const FluentRefZoomInIcon = () => (
  <svg {...base}>
    <path d="M6.5 4c.28 0 .5.22.5.5V6h1.5a.5.5 0 0 1 0 1H7v1.5a.5.5 0 0 1-1 0V7H4.5a.5.5 0 0 1 0-1H6V4.5c0-.28.22-.5.5-.5m0-3a5.5 5.5 0 0 1 4.23 9.02l3.12 3.13a.5.5 0 1 1-.7.7l-3.13-3.12A5.5 5.5 0 1 1 6.5 1m0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9" />
  </svg>
);

/** Fluent `zoom_in_16_filled`. */
export const FluentRefZoomInFilledIcon = () => (
  <svg {...base}>
    <path d="M6.5 1a5.5 5.5 0 0 1 4.23 9.02l3.12 3.13a.5.5 0 1 1-.7.7l-3.13-3.12A5.5 5.5 0 1 1 6.5 1m0 3a.5.5 0 0 0-.5.5V6H4.5a.5.5 0 0 0 0 1H6v1.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H7V4.5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `zoom_out_16_regular`. */
export const FluentRefZoomOutIcon = () => (
  <svg {...base}>
    <path d="M8.5 6a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1zm-2-5a5.5 5.5 0 0 1 4.23 9.02l3.12 3.13a.5.5 0 1 1-.7.7l-3.13-3.12A5.5 5.5 0 1 1 6.5 1m0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9" />
  </svg>
);

/** Fluent `zoom_out_16_filled`. */
export const FluentRefZoomOutFilledIcon = () => (
  <svg {...base}>
    <path d="M6.5 1a5.5 5.5 0 0 1 4.23 9.02l3.12 3.13a.5.5 0 1 1-.7.7l-3.13-3.12A5.5 5.5 0 1 1 6.5 1m-2 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `flag_16_regular`. */
export const FluentRefFlagIcon = () => (
  <svg {...base}>
    <path d="M4 9V3h8.03l-1.94 2.7a.5.5 0 0 0 0 .6L12.03 9zm0 1h9a.5.5 0 0 0 .4-.8L11.12 6l2.3-3.2A.5.5 0 0 0 13 2H3.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `flag_16_filled`. */
export const FluentRefFlagFilledIcon = () => (
  <svg {...base}>
    <path d="M4 10h9a.5.5 0 0 0 .4-.8L11.12 6l2.3-3.2A.5.5 0 0 0 13 2H3.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `archive_16_regular`. */
export const FluentRefArchiveIcon = () => (
  <svg {...base}>
    <path d="M6.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM1 3.5C1 2.67 1.67 2 2.5 2h11c.83 0 1.5.67 1.5 1.5v1c0 .65-.42 1.2-1 1.41v5.59a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5V5.91c-.58-.2-1-.76-1-1.41zM2.5 3a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 6v5.5c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V6z" />
  </svg>
);

/** Fluent `archive_16_filled`. */
export const FluentRefArchiveFilledIcon = () => (
  <svg {...base}>
    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm1 3h12v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm4.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `cloud_16_regular`. */
export const FluentRefCloudIcon = () => (
  <svg {...base}>
    <path d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h7.5a2.25 2.25 0 0 0 0-4.5h-.25A.5.5 0 0 1 11 6a3 3 0 0 0-3-3M4.03 5.5a4 4 0 0 1 7.94 0 3.25 3.25 0 0 1-.22 6.5h-7.5a3.25 3.25 0 0 1-.22-6.5" />
  </svg>
);

/** Fluent `cloud_16_filled`. */
export const FluentRefCloudFilledIcon = () => (
  <svg {...base}>
    <path d="M4.03 5.5a4 4 0 0 1 7.94 0 3.25 3.25 0 0 1-.22 6.5h-7.5a3.25 3.25 0 0 1-.22-6.5" />
  </svg>
);

/** Fluent `phone_16_regular`. */
export const FluentRefPhoneIcon = () => (
  <svg {...base}>
    <path d="M7 12a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zM5.75 1C4.78 1 4 1.78 4 2.75v10.5c0 .97.78 1.75 1.75 1.75h4.5c.97 0 1.75-.78 1.75-1.75V2.75C12 1.78 11.22 1 10.25 1zM5 2.75c0-.41.34-.75.75-.75h4.5c.41 0 .75.34.75.75v10.5c0 .41-.34.75-.75.75h-4.5a.75.75 0 0 1-.75-.75z" />
  </svg>
);

/** Fluent `phone_16_filled`. */
export const FluentRefPhoneFilledIcon = () => (
  <svg {...base}>
    <path d="M4 2.75C4 1.78 4.78 1 5.75 1h4.5c.97 0 1.75.78 1.75 1.75v10.5c0 .97-.78 1.75-1.75 1.75h-4.5C4.78 15 4 14.22 4 13.25zM7 12a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `camera_16_regular`. */
export const FluentRefCameraIcon = () => (
  <svg {...base}>
    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0M6.62 2a1.5 1.5 0 0 0-1.34.83L4.69 4H4a2 2 0 0 0-2 2v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-.7l-.58-1.17A1.5 1.5 0 0 0 9.38 2zm-.45 1.28A.5.5 0 0 1 6.62 3h2.76q.3 0 .45.28l.72 1.44A.5.5 0 0 0 11 5h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1a.5.5 0 0 0 .45-.28z" />
  </svg>
);

/** Fluent `camera_16_filled`. */
export const FluentRefCameraFilledIcon = () => (
  <svg {...base}>
    <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0M5.28 2.83c.25-.5.77-.83 1.34-.83h2.76c.57 0 1.09.32 1.34.83L11.31 4H12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h.7zM11 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
  </svg>
);

/** Fluent `cart_16_regular`. */
export const FluentRefCartIcon = () => (
  <svg {...base}>
    <path d="M2.5 2a.5.5 0 0 0 0 1h.25a.5.5 0 0 1 .48.36L4.8 8.91A1.5 1.5 0 0 0 6.25 10h4.57a1.5 1.5 0 0 0 1.4-.94l1.47-3.69A1 1 0 0 0 12.76 4H4.45l-.26-.91A1.5 1.5 0 0 0 2.75 2zm3.27 6.64L4.73 5h8.03L11.3 8.69a.5.5 0 0 1-.47.31H6.25a.5.5 0 0 1-.48-.36M6.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m4 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1" />
  </svg>
);

/** Fluent `cart_16_filled`. */
export const FluentRefCartFilledIcon = () => (
  <svg {...base}>
    <path d="M2.5 2a.5.5 0 0 0 0 1h.25a.5.5 0 0 1 .48.36L4.8 8.91A1.5 1.5 0 0 0 6.25 10h4.57a1.5 1.5 0 0 0 1.4-.94l1.47-3.69A1 1 0 0 0 12.76 4H4.45l-.26-.91A1.5 1.5 0 0 0 2.75 2zm4 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

/** Fluent `text_bold_16_regular`. */
export const FluentRefBoldIcon = () => (
  <svg {...base}>
    <path d="M4 3.1C4 2.5 4.5 2 5.1 2h3c2.1 0 3.4 1.4 3.4 3.4 0 .9-.3 2-.7 2.6.8.6 1.4 1.2 1.4 2.5 0 2.7-2.1 3.5-3.6 3.5H5.1c-.6 0-1.1-.5-1.1-1.1zM6 9v3h2.4c.7 0 1.5-.5 1.5-1.5S9.1 9 8.4 9zm0-2h2.2c.9 0 1.5-.7 1.5-1.5S9.1 4 8.3 4H6z" />
  </svg>
);

/** Fluent `text_bold_16_filled`. */
export const FluentRefBoldFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3.3C4 2.6 4.6 2 5.3 2h3.3c2 0 3.5 1.7 3.5 3.5 0 .7-.2 1.4-.6 1.9.7.6 1.2 1.6 1.2 2.8 0 2.4-2 3.7-3.7 3.7H5.3c-.7.1-1.3-.5-1.3-1.2zm2.6 1.3v1.9h2a1 1 0 0 0 0-2h-2zm0 4.5v2.4H9c.6 0 1.2-.5 1.2-1.2S9.6 9.1 9 9.1z" />
  </svg>
);

/** Fluent `text_italic_16_regular`. */
export const FluentRefItalicIcon = () => (
  <svg {...base}>
    <path d="M13 2H7a.5.5 0 0 0 0 1h2.47L5.66 13H3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H6.73l3.81-10H13a.5.5 0 0 0 0-1" />
  </svg>
);

/** Fluent `text_italic_16_filled`. */
export const FluentRefItalicFilledIcon = () => (
  <svg {...base}>
    <path d="M12.8 2H7a.75.75 0 0 0 0 1.5H9l-3.43 9H3.2a.75.75 0 0 0 0 1.5H9a.75.75 0 0 0 0-1.5H7.19l3.43-9h2.18a.75.75 0 0 0 0-1.5" />
  </svg>
);

/** Fluent `text_underline_16_regular`. */
export const FluentRefUnderlineIcon = () => (
  <svg {...base}>
    <path d="M4.5 2c.28 0 .5.22.5.5V8c0 1.62 1.38 3 3 3s3-1.38 3-3V2.5a.5.5 0 0 1 1 0V8c0 2.18-1.82 4-4 4s-4-1.82-4-4V2.5c0-.28.22-.5.5-.5M4 13.5c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `text_underline_16_filled`. */
export const FluentRefUnderlineFilledIcon = () => (
  <svg {...base}>
    <path d="M4 13.75c0-.41.34-.75.75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75M4.75 2c.41 0 .75.34.75.75V8a2.5 2.5 0 1 0 5 0V2.75a.75.75 0 0 1 1.5 0V8a4 4 0 1 1-8 0V2.75c0-.41.34-.75.75-.75" />
  </svg>
);

/** Fluent `text_quote_16_regular`. */
export const FluentRefQuoteIcon = () => (
  <svg {...base}>
    <path d="M11 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.89 2.8a7.3 7.3 0 0 1-2.24 4.35.5.5 0 0 0 .7.7C12.47 9.73 13 7.6 13 5a2 2 0 1 0-1.11 1.8M5 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.89 2.8a7.3 7.3 0 0 1-2.24 4.35.5.5 0 0 0 .7.7C6.47 9.73 7 7.6 7 5a2 2 0 1 0-1.11 1.8" />
  </svg>
);

/** Fluent `text_quote_16_filled`. */
export const FluentRefQuoteFilledIcon = () => (
  <svg {...base}>
    <path d="M9.65 11.15a7.3 7.3 0 0 0 2.24-4.36A2 2 0 1 1 13 5c0 2.6-.53 4.74-2.65 6.86a.5.5 0 0 1-.7-.7m-6 0a7.3 7.3 0 0 0 2.24-4.36A2 2 0 1 1 7 5c0 2.6-.53 4.74-2.65 6.86a.5.5 0 0 1-.7-.7" />
  </svg>
);

/** Fluent `number_symbol_16_regular`. */
export const FluentRefHashIcon = () => (
  <svg {...base}>
    <path d="M7 2.6a.5.5 0 1 0-1-.19L5.55 5H3.5a.5.5 0 0 0 0 1h1.86l-.73 4H2.5a.5.5 0 0 0 0 1h1.95L4 13.41a.5.5 0 0 0 .98.18L5.46 11h3.98l-.43 2.4a.5.5 0 0 0 .98.19l.47-2.59h2.04a.5.5 0 0 0 0-1h-1.86l.73-4h2.13a.5.5 0 1 0 0-1h-1.95L12 2.6a.5.5 0 1 0-.98-.19l-.47 2.6H6.55zM6.36 6h3.99l-.73 4H5.64z" />
  </svg>
);

/** Fluent `number_symbol_16_filled`. */
export const FluentRefHashFilledIcon = () => (
  <svg {...base}>
    <path d="M12 2.85a.75.75 0 0 0-1.5-.2L10.18 5H6.7l.3-2.14a.75.75 0 1 0-1.48-.22L5.17 5H3.75a.75.75 0 0 0 0 1.5h1.2l-.42 3H2.75a.75.75 0 1 0 0 1.5h1.56l-.3 2.14a.75.75 0 1 0 1.48.22L5.83 11h3.49L9 13.14a.75.75 0 1 0 1.48.22l.34-2.36h1.42a.75.75 0 0 0 0-1.5h-1.2l.42-3h1.78a.75.75 0 0 0 0-1.5h-1.56zM9.95 6.5l-.43 3H6.04l.43-3z" />
  </svg>
);

/** Fluent `mention_16_regular`. */
export const FluentRefAtIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 0 1 7 7c0 2.13-1.1 3.5-2.5 3.5-.89 0-1.65-.55-2.1-1.49a3.2 3.2 0 0 1-2.65 1.49C5.92 11.5 4.5 9.9 4.5 8s1.42-3.5 3.25-3.5c.89 0 1.67.37 2.25.97V5a.5.5 0 0 1 1 0v3c0 1.87.9 2.5 1.5 2.5S14 9.87 14 8a6 6 0 1 0-3.75 5.56c.2-.08.44-.04.6.11.24.24.18.65-.14.79Q9.45 14.99 8 15A7 7 0 0 1 8 1m-.25 4.5C6.55 5.5 5.5 6.58 5.5 8s1.05 2.5 2.25 2.5S10 9.42 10 8 8.95 5.5 7.75 5.5" />
  </svg>
);

/** Fluent `mention_16_filled`. */
export const FluentRefAtFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 0 1 7 7l-.01.39c-.14 1.9-1.28 3.17-2.74 3.17a2.5 2.5 0 0 1-2.1-1.2 3.1 3.1 0 0 1-2.4 1.14C5.89 11.5 4.5 9.86 4.5 8s1.39-3.5 3.25-3.5q1.01.01 1.77.57a.75.75 0 0 1 1.48.18V8c0 1.63.81 2.06 1.25 2.06.41 0 1.15-.38 1.24-1.77L13.5 8a5.5 5.5 0 1 0-3.68 5.19c.31-.11.66-.05.9.18.36.36.28.98-.2 1.16Q9.32 15 8 15A7 7 0 0 1 8 1m-.25 5C6.85 6 6 6.83 6 8s.85 2 1.75 2S9.5 9.17 9.5 8s-.85-2-1.75-2" />
  </svg>
);

/** Fluent `key_16_regular`. */
export const FluentRefKeyIcon = () => (
  <svg {...base}>
    <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    <path d="M7.5 12v-.5h1A.5.5 0 0 0 9 11v-1h1a4 4 0 1 0-3.84-2.87L2.3 11a1 1 0 0 0-.29.7V13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.5h1a.5.5 0 0 0 .5-.5M7 6a3 3 0 1 1 3 3H8.5a.5.5 0 0 0-.5.5v1H7a.5.5 0 0 0-.5.5v.5h-1a.5.5 0 0 0-.5.5v1H3v-1.3l4.09-4.08a.5.5 0 0 0 .11-.54A3 3 0 0 1 7 6" />
  </svg>
);

/** Fluent `key_16_filled`. */
export const FluentRefKeyFilledIcon = () => (
  <svg {...base}>
    <path d="M7.5 11.5v.5a.5.5 0 0 1-.5.5H6v.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1.3a1 1 0 0 1 .3-.7l3.86-3.87A4 4 0 1 1 10 10H9v1a.5.5 0 0 1-.5.5zM11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `shield_16_regular`. */
export const FluentRefShieldIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v3c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.64 12.91 3 10.72 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85M8 3.19a6.7 6.7 0 0 1-4 1.8V7.5q.02 2.14 1.02 3.45.94 1.29 2.98 2.02a6 6 0 0 0 2.98-2.02A5.6 5.6 0 0 0 12 7.5V4.98a6.6 6.6 0 0 1-4-1.8" />
  </svg>
);

/** Fluent `shield_16_filled`. */
export const FluentRefShieldFilledIcon = () => (
  <svg {...base}>
    <path d="M7.65 2.15c.2-.2.5-.2.7 0A5.7 5.7 0 0 0 12.5 4c.28 0 .5.22.5.5v3c0 3.22-1.64 5.4-4.84 6.47a.5.5 0 0 1-.32 0C4.64 12.91 3 10.72 3 7.5v-3c0-.28.22-.5.5-.5q2.29 0 4.15-1.85" />
  </svg>
);

/** Fluent `gift_16_regular`. */
export const FluentRefGiftIcon = () => (
  <svg {...base}>
    <path d="M6 2a2 2 0 0 1 1.5.68A2 2 0 0 1 10.73 5H12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.27A2 2 0 0 1 6 2M5 4a1 1 0 0 0 1 1h1V4a1 1 0 0 0-2 0m3 2v2h4V6zM7 6H3v2h4zM4 9v3a1 1 0 0 0 1 1h2V9zm4 4h2a1 1 0 0 0 1-1V9H8zm2-9a1 1 0 0 0-2 0v1h1a1 1 0 0 0 1-1" />
  </svg>
);

/** Fluent `gift_16_filled`. */
export const FluentRefGiftFilledIcon = () => (
  <svg {...base}>
    <path d="M8 5H7v3H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.27A2 2 0 0 1 7.5 2.68 2 2 0 0 1 10.73 5H12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8zM5 4a1 1 0 0 0 1 1h1V4a1 1 0 0 0-2 0m3 1h1a1 1 0 1 0-1-1zm4 4H8v5h2a2 2 0 0 0 2-2zm-5 5V9H3v3c0 1.1.9 2 2 2z" />
  </svg>
);

/** Fluent `map_16_regular`. */
export const FluentRefMapIcon = () => (
  <svg {...base}>
    <path d="M5.24 2.08a.5.5 0 0 1 .48-.03l4.75 2.38 3.76-2.35a.5.5 0 0 1 .77.42V11a.5.5 0 0 1-.23.42l-4 2.5a.5.5 0 0 1-.5.03l-4.74-2.38-3.77 2.35A.5.5 0 0 1 1 13.5V5a.5.5 0 0 1 .24-.42zM6 10.69l4 2V5.31l-4-2zM5 3.4 2 5.28v7.32l3-1.88zm6 1.88v7.32l3-1.88V3.4z" />
  </svg>
);

/** Fluent `map_16_filled`. */
export const FluentRefMapFilledIcon = () => (
  <svg {...base}>
    <path d="M5 2.22 1.24 4.58A.5.5 0 0 0 1 5v8.5a.5.5 0 0 0 .76.42L5 11.9zm1 9.59 4 2V4.19l-4-2zm8.77-.39L11 13.78V4.1l3.23-2.02a.5.5 0 0 1 .77.42V11a.5.5 0 0 1-.23.42" />
  </svg>
);

/** Fluent `data_line_16_regular`. */
export const FluentRefChartIcon = () => (
  <svg {...base}>
    <path d="M13 6a2 2 0 1 0-1.5-.67L9.97 7.25a2 2 0 0 0-2.8 2.56l-2.5 1.08a2 2 0 1 0 .32.94l2.84-1.21a2 2 0 0 0 2.87-2.68l1.63-2.05A2 2 0 0 0 13 6m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-9 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

/** Fluent `data_line_16_filled`. */
export const FluentRefChartFilledIcon = () => (
  <svg {...base}>
    <path d="M15 4a2 2 0 0 1-2.67 1.89L10.7 7.94Q11 8.4 11 9a2 2 0 0 1-3.17 1.62l-2.84 1.21.01.15V12a2 2 0 1 1-.34-1.11L7.17 9.8A2 2 0 0 1 9 7a2 2 0 0 1 .97.25l1.53-1.92A2 2 0 1 1 15 4" />
  </svg>
);

/** Fluent `table_16_regular`. */
export const FluentRefTableIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM6 13h4v-2H6zm-1-2H3v.5c0 .83.67 1.5 1.5 1.5H5zm1-1h4V6H6zM5 6H3v4h2zm1-1h4V3H6zM5 3h-.5C3.67 3 3 3.67 3 4.5V5h2zm8 3h-2v4h2zm0 5h-2v2h.5c.83 0 1.5-.67 1.5-1.5zm0-6v-.5c0-.83-.67-1.5-1.5-1.5H11v2z" />
  </svg>
);

/** Fluent `table_16_filled`. */
export const FluentRefTableFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5V5h3V2zM6 2v3h4V2zM5 6H2v4h3zm1 4V6h4v4zm-1 1H2v.5A2.5 2.5 0 0 0 4.5 14H5zm1 3h4v-3H6zm5 0v-3h3v.5a2.5 2.5 0 0 1-2.5 2.5zm3-8v4h-3V6zm0-1v-.5A2.5 2.5 0 0 0 11.5 2H11v3z" />
  </svg>
);

/** Fluent `text_strikethrough_16_regular`. */
export const FluentRefStrikethroughIcon = () => (
  <svg {...base}>
    <path d="M5 5.1q.01-.84.84-1.46C6.39 3.25 7.19 3 8.1 3c1.3 0 2.38.56 2.76 1.24a.5.5 0 0 0 .88-.48C11.12 2.64 9.6 2 8.1 2c-1.09 0-2.1.3-2.84.83A2.8 2.8 0 0 0 4 5.1c0 .72.3 1.37.79 1.9H6.5C5.55 6.6 5 5.83 5 5.1M13.5 8a.5.5 0 0 1 0 1h-2.34c.52.5.84 1.15.84 1.9 0 .9-.51 1.69-1.26 2.23C10 13.67 9 14 7.9 14c-1.62 0-3-.65-3.72-1.72a.5.5 0 0 1 .84-.56C5.5 12.45 6.52 13 7.9 13c.9 0 1.7-.27 2.25-.68.56-.4.85-.92.85-1.42 0-.78-.63-1.53-1.78-1.9H2.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `text_strikethrough_16_filled`. */
export const FluentRefStrikethroughFilledIcon = () => (
  <svg {...base}>
    <path d="M5.55 5.3q0-.64.67-1.18a3 3 0 0 1 1.88-.57c1.12 0 2.04.52 2.36 1.05a.75.75 0 1 0 1.28-.8c-.68-1.07-2.16-1.75-3.64-1.75-1.05 0-2.03.32-2.78.87A3 3 0 0 0 4.05 5.3q.01.8.42 1.45H6.7c-.77-.36-1.14-.95-1.14-1.45M2 8.75c0-.41.34-.75.75-.75h10.5a.75.75 0 0 1 0 1.5h-1.64q.34.6.34 1.3c0 .99-.53 1.82-1.28 2.37-.74.56-1.72.88-2.77.88-1.49 0-2.99-.68-3.66-1.89a.75.75 0 1 1 1.32-.72c.33.6 1.23 1.11 2.34 1.11.75 0 1.42-.23 1.87-.58s.68-.76.68-1.17c0-.44-.28-.94-.86-1.3H2.75A.75.75 0 0 1 2 8.75" />
  </svg>
);

/** Fluent `text_header_1_20_regular`. */
export const FluentRefHeadingIcon = () => (
  <svg {...base20}>
    <path d="M16.55 4a.5.5 0 0 1 .45.5v11a.5.5 0 0 1-1 0V6.73a9 9 0 0 1-2.22 2.19.5.5 0 1 1-.56-.84 6.8 6.8 0 0 0 2.83-3.8.5.5 0 0 1 .5-.28M2.5 4c.28 0 .5.22.5.5V9h6V4.5a.5.5 0 1 1 1 0v11a.5.5 0 0 1-1 0V10H3v5.5a.5.5 0 0 1-1 0v-11c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `text_header_1_20_filled`. */
export const FluentRefHeadingFilledIcon = () => (
  <svg {...base20}>
    <path d="M9.25 4c.41 0 .75.34.75.75v10.5a.75.75 0 0 1-1.5 0V10.5h-5v4.75a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0V9h5V4.75c0-.41.34-.75.75-.75m7.11 0c.37.06.64.38.64.75v10.5a.75.75 0 0 1-1.5 0V7.46a10 10 0 0 1-1.81 1.65l-.07.04a.75.75 0 0 1-.8-1.27l.4-.28a8 8 0 0 0 2.3-3.01l.01-.06c.11-.35.46-.58.83-.52" />
  </svg>
);

/** Fluent `text_bullet_list_ltr_16_regular`. */
export const FluentRefListBulletIcon = () => (
  <svg {...base}>
    <path d="M2 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `text_bullet_list_ltr_16_filled`. */
export const FluentRefListBulletFilledIcon = () => (
  <svg {...base}>
    <path d="M2.25 5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m0 4.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m1.25 3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M5.75 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8m.75 3.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `wifi_1_20_regular`. */
export const FluentRefWifiIcon = () => (
  <svg {...base20}>
    <path d="M16.83 7.38q.62.63 1.14 1.37a.5.5 0 0 1-.83.57 8.61 8.61 0 0 0-14.2 0 .5.5 0 0 1-.82-.58 9.61 9.61 0 0 1 14.71-1.36M14.6 9.36q.71.72 1.19 1.65a.5.5 0 0 1-.89.46q-.4-.8-1.01-1.4a5.45 5.45 0 0 0-8.72 1.38.5.5 0 1 1-.89-.45q.45-.9 1.2-1.64a6.45 6.45 0 0 1 9.12 0m-1.71 2.5q.53.53.85 1.25a.5.5 0 0 1-.92.4 3.03 3.03 0 0 0-5.56-.01.5.5 0 1 1-.92-.4q.3-.72.84-1.25a4.03 4.03 0 0 1 5.7 0m-1.93 1.93a1.3 1.3 0 1 1-1.83 1.83 1.3 1.3 0 0 1 1.83-1.83" />
  </svg>
);

/** Fluent `wifi_1_20_filled`. */
export const FluentRefWifiFilledIcon = () => (
  <svg {...base20}>
    <path d="M16.73 7.56q.6.62 1.11 1.35a.75.75 0 0 1-1.23.85q-.43-.62-.94-1.14a7.97 7.97 0 0 0-12.2 1.14.75.75 0 1 1-1.23-.86q.51-.75 1.1-1.34c3.7-3.7 9.7-3.7 13.39 0m-2.14 1.9c.47.46.88 1.04 1.2 1.64a.75.75 0 1 1-1.34.69 4.94 4.94 0 0 0-8.82-.02.75.75 0 0 1-1.34-.67q.45-.91 1.19-1.65a6.44 6.44 0 0 1 9.11 0m-1.64 2.38q.56.55.87 1.28a.75.75 0 0 1-1.37.6q-.2-.47-.56-.82a2.63 2.63 0 0 0-4.26.81.75.75 0 1 1-1.38-.6q.32-.71.86-1.27a4.13 4.13 0 0 1 5.84 0m-2.03 2.04a1.24 1.24 0 1 1-1.76 1.76 1.24 1.24 0 0 1 1.76-1.76" />
  </svg>
);

/** Fluent `bluetooth_16_regular`. */
export const FluentRefBluetoothIcon = () => (
  <svg {...base}>
    <path d="M7.29 1.05a.5.5 0 0 1 .53.06l4 3.25a.5.5 0 0 1 0 .78L8.29 8l3.53 2.86a.5.5 0 0 1 0 .78l-4 3.25A.5.5 0 0 1 7 14.5V9.05l-3.18 2.59a.5.5 0 0 1-.64-.78L6.71 8 3.18 5.14a.5.5 0 1 1 .64-.78L7 6.95V1.5q.01-.31.29-.45m.71 8v4.4l2.7-2.2zm0-2.1 2.7-2.2L8 2.55z" />
  </svg>
);

/** Fluent `bluetooth_16_filled`. */
export const FluentRefBluetoothFilledIcon = () => (
  <svg {...base}>
    <path d="M7.41 1.08c.26-.13.56-.1.79.07l4 3a.75.75 0 0 1 .02 1.18L8.94 8l3.28 2.67a.75.75 0 0 1-.02 1.18l-4 3a.75.75 0 0 1-1.2-.6V9.58l-2.78 2.25a.75.75 0 0 1-.94-1.16L6.56 8 3.28 5.33a.75.75 0 1 1 .94-1.16L7 6.42V1.75c0-.28.16-.54.41-.67m1.09 8.5v3.17l2.03-1.52zm0-3.16 2.03-1.65L8.5 3.25z" />
  </svg>
);

/** Fluent `battery_10_16_regular`. */
export const FluentRefBatteryIcon = () => (
  <svg {...base}>
    <path d="M4 6h7.5v4H4zm9.5.5h.5c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h7.5a2 2 0 0 1 2 2zm-2 4.5a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
  </svg>
);

/** Fluent `battery_10_16_filled`. */
export const FluentRefBatteryFilledIcon = () => (
  <svg {...base}>
    <path d="M14 6.5h-.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h7.5a2 2 0 0 0 2-2v-.5h.5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5M12 10a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V6c0-.28.23-.5.5-.5h7.5c.28 0 .5.22.5.5z" />
  </svg>
);

/** Fluent `plug_connected_16_regular`. */
export const FluentRefPlugIcon = () => (
  <svg {...base}>
    <path d="M6.01 6.78a1.25 1.25 0 0 0-1.76 0L4.03 7a3.5 3.5 0 0 0-.32 4.58l-2.06 2.07a.5.5 0 0 0 .7.7l2.08-2.07q.92.66 2.03.66c.94 0 1.89-.37 2.6-1.08l.14-.14c.48-.48.48-1.28 0-1.76zm2.48 4.24-.13.13c-1 1-2.6 1.06-3.57.14a2.5 2.5 0 0 1-.06-3.59l.22-.22a.3.3 0 0 1 .18-.07q.1 0 .18.07l3.18 3.18c.1.1.1.26 0 .36m5.86-9.37a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7M11.27 8.3l-.22.22c-.1.1-.26.1-.36 0L7.51 5.34a.25.25 0 0 1 0-.36l.13-.13a2.7 2.7 0 0 1 1.9-.79c.61 0 1.21.21 1.67.65a2.5 2.5 0 0 1 .06 3.59" />
  </svg>
);

/** Fluent `plug_connected_16_filled`. */
export const FluentRefPlugFilledIcon = () => (
  <svg {...base}>
    <path d="M6.01 6.78a1.25 1.25 0 0 0-1.76 0L4.03 7a3.5 3.5 0 0 0-.32 4.58l-2.06 2.07a.5.5 0 0 0 .7.7l2.08-2.07q.92.66 2.03.66c.94 0 1.89-.37 2.6-1.08l.14-.14c.48-.48.48-1.28 0-1.76zm8.34-5.13a.5.5 0 0 0-.7 0l-2.07 2.07a3.6 3.6 0 0 0-4.64.42l-.13.14a1.25 1.25 0 0 0 0 1.76l3.18 3.19a1.24 1.24 0 0 0 1.77 0l.22-.22a3.47 3.47 0 0 0 .31-4.6l2.06-2.06a.5.5 0 0 0 0-.7" />
  </svg>
);

/** Fluent `power_20_regular`. */
export const FluentRefPowerIcon = () => (
  <svg {...base20}>
    <path d="M10.5 2.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zM13.74 4a.5.5 0 1 0-.5.87 6.5 6.5 0 1 1-6.49 0 .5.5 0 1 0-.5-.87 7.5 7.5 0 1 0 7.5 0" />
  </svg>
);

/** Fluent `power_20_filled`. */
export const FluentRefPowerFilledIcon = () => (
  <svg {...base20}>
    <path d="M10.75 2.5a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0zm3 1.5a.75.75 0 1 0-.76 1.3A6 6 0 1 1 7 5.3.75.75 0 1 0 6.25 4a7.5 7.5 0 1 0 7.5 0" />
  </svg>
);

/** Fluent `print_16_regular`. */
export const FluentRefPrinterIcon = () => (
  <svg {...base}>
    <path d="M4 3.5C4 2.67 4.67 2 5.5 2h5c.83 0 1.5.67 1.5 1.5V4h1a2 2 0 0 1 2 2v4.5c0 .83-.67 1.5-1.5 1.5H12v.5c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 12.5V12H2.5A1.5 1.5 0 0 1 1 10.5V6c0-1.1.9-2 2-2h1zM4 11v-.5C4 9.67 4.67 9 5.5 9h5c.83 0 1.5.67 1.5 1.5v.5h1.5a.5.5 0 0 0 .5-.5V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4.5c0 .28.22.5.5.5zm1-7h6v-.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5zm0 6.5v2c0 .28.22.5.5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `print_16_filled`. */
export const FluentRefPrinterFilledIcon = () => (
  <svg {...base}>
    <path d="M4 3.5C4 2.67 4.67 2 5.5 2h5c.83 0 1.5.67 1.5 1.5V4h1a2 2 0 0 1 2 2v4.5c0 .83-.67 1.5-1.5 1.5H12v.5c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 4 12.5V12H2.5A1.5 1.5 0 0 1 1 10.5V6c0-1.1.9-2 2-2h1zm7 0a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V4h6zm-6 7v2c0 .28.22.5.5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5" />
  </svg>
);

/** Fluent `headphones_16_regular`. */
export const FluentRefHeadphonesIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 0 1 7 7v4.5a2.5 2.5 0 0 1-2.5 2.5h-2a.5.5 0 0 1-.5-.5v-5c0-.28.22-.5.5-.5H14V8A6 6 0 0 0 2 8v1h3.5c.28 0 .5.22.5.5v5a.5.5 0 0 1-.5.5h-2a2.5 2.5 0 0 1-2.49-2.24L1 12.5V8a7 7 0 0 1 7-7M2 12.5v.15A1.5 1.5 0 0 0 3.5 14H5v-4H2zm9 1.5h1.5c.83 0 1.5-.67 1.5-1.5V10h-3z" />
  </svg>
);

/** Fluent `headphones_16_filled`. */
export const FluentRefHeadphonesFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 0 1 7 7v4.5a2.5 2.5 0 0 1-2.5 2.5h-2a.5.5 0 0 1-.5-.5v-5c0-.28.22-.5.5-.5H14V8A6 6 0 0 0 2 8v1h3.5c.28 0 .5.22.5.5v5a.5.5 0 0 1-.5.5h-2a2.5 2.5 0 0 1-2.49-2.24L1 12.5V8a7 7 0 0 1 7-7" />
  </svg>
);

/** Fluent `video_16_regular`. */
export const FluentRefVideoIcon = () => (
  <svg {...base}>
    <path d="M3.5 3A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h5a2.5 2.5 0 0 0 2.5-2.5v-.13l2.04 1.4c.82.58 1.96-.01 1.96-1.02v-5.5c0-1-1.14-1.6-1.96-1.03L11 5.62V5.5A2.5 2.5 0 0 0 8.5 3zM11 6.84l2.6-1.8c.17-.1.4.01.4.21v5.5c0 .2-.23.32-.4.2L11 9.16zM2 5.5C2 4.67 2.67 4 3.5 4h5c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 2 10.5z" />
  </svg>
);

/** Fluent `video_16_filled`. */
export const FluentRefVideoFilledIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h4A2.5 2.5 0 0 1 10 5.5v5A2.5 2.5 0 0 1 7.5 13h-4A2.5 2.5 0 0 1 1 10.5zm12.04 6.28L10.9 10.3l.02-.28V5.98q0-.15-.02-.28l2.14-1.48c.82-.57 1.96.02 1.96 1.03v5.5c0 1-1.14 1.6-1.96 1.03" />
  </svg>
);

/** Fluent `mail_inbox_16_regular`. */
export const FluentRefInboxIcon = () => (
  <svg {...base}>
    <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2zM13 8h-2.59a.5.5 0 0 0-.41.5q0 .08-.03.3-.06.39-.23.73c-.3.61-.84.97-1.74.97s-1.43-.36-1.74-.97A3 3 0 0 1 6 8.5a.5.5 0 0 0-.5-.5H3V4.5C3 3.67 3.67 3 4.5 3h7c.83 0 1.5.67 1.5 1.5zM3 9h2.04l.04.17q.08.4.29.8c.47.95 1.34 1.53 2.63 1.53s2.16-.58 2.63-1.53l.1-.2q.13-.3.2-.6l.03-.17H13v2.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z" />
  </svg>
);

/** Fluent `mail_inbox_16_filled`. */
export const FluentRefInboxFilledIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM13 8V4.5c0-.83-.67-1.5-1.5-1.5h-7C3.67 3 3 3.67 3 4.5V8h2.5c.28 0 .5.22.5.5q0 .08.03.3.06.39.23.73c.3.61.84.97 1.74.97s1.43-.36 1.74-.97A3 3 0 0 0 10 8.5a.5.5 0 0 1 .41-.5H13" />
  </svg>
);

/** Fluent `presence_available_16_regular`. */
export const PresenceAvailableIcon = () => (
  <svg {...base}>
    <path d="M11.7 6.7a1 1 0 0 0-1.4-1.4L7 8.58l-1.3-1.3a1 1 0 0 0-1.4 1.42l2 2a1 1 0 0 0 1.4 0zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2" />
  </svg>
);

/** Fluent `alert_16_filled`. */
export const FluentBellFilledIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h10a.5.5 0 0 0 .46-.69l-.96-2.4V6.5A4.5 4.5 0 0 0 8 2m0 12.5A2 2 0 0 1 6.06 13h3.88A2 2 0 0 1 8 14.5" />
  </svg>
);

/** Fluent `info_16_filled`. */
export const FluentInfoFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 5.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m.5 1.25a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `settings_16_filled`. */
export const FluentSettingsFilledIcon = () => (
  <svg {...base}>
    <path d="M2.27 6.15q.4-1.21 1.26-2.17.17-.16.38-.1l1.36.49a.7.7 0 0 0 .94-.54l.26-1.41a.4.4 0 0 1 .27-.29 6 6 0 0 1 2.52 0q.23.06.27.28l.26 1.42a.7.7 0 0 0 .94.54l1.36-.49a.4.4 0 0 1 .38.1q.86.96 1.26 2.17.06.23-.1.38l-1.1.93a.7.7 0 0 0 0 1.08l1.1.93q.16.16.1.38-.4 1.21-1.26 2.17-.17.16-.38.1l-1.36-.49a.7.7 0 0 0-.94.54l-.26 1.41a.4.4 0 0 1-.27.29 6 6 0 0 1-2.52 0 .4.4 0 0 1-.27-.29l-.26-1.41a.7.7 0 0 0-.94-.54l-1.36.49a.4.4 0 0 1-.38-.1q-.86-.96-1.26-2.17a.4.4 0 0 1 .1-.38l1.1-.93a.7.7 0 0 0 0-1.08l-1.1-.93a.4.4 0 0 1-.1-.38M6.25 8a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0" />
  </svg>
);

/** Fluent `eye_16_filled`. */
export const FluentEyeFilledIcon = () => (
  <svg {...base}>
    <path d="M2.98 8.62a.5.5 0 0 1-.6.36c-.44-.11-.36-.6-.36-.6l.01-.07.05-.14q.06-.2.2-.5c.18-.4.47-.95.92-1.49C4.1 5.08 5.6 4 8 4s3.9 1.09 4.8 2.18a7 7 0 0 1 1.18 2.17v.02a.5.5 0 0 1-.96.26L13 8.6a3 3 0 0 0-.2-.52 6 6 0 0 0-.78-1.26A5 5 0 0 0 8 5c-2.04 0-3.29.91-4.03 1.82A6 6 0 0 0 3 8.6zm2.52.88a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0" />
  </svg>
);

/** Fluent `align_left_16_filled`. */
export const FluentAlignLeftFilledIcon = () => (
  <svg {...base}>
    <path d="M2 1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-1 0zm3.75.5C4.78 2 4 2.78 4 3.75v1.5C4 6.22 4.78 7 5.75 7h6.5C13.22 7 14 6.22 14 5.25v-1.5C14 2.78 13.22 2 12.25 2zm0 7C4.78 9 4 9.78 4 10.75v1.5c0 .97.78 1.75 1.75 1.75h4.5c.97 0 1.75-.78 1.75-1.75v-1.5C12 9.78 11.22 9 10.25 9z" />
  </svg>
);

/** Fluent `checkmark_circle_16_filled`. */
export const FluentCheckCircleFilledIcon = () => (
  <svg {...base}>
    <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m9.85-1.15a.5.5 0 0 0-.7-.7l-2.9 2.9-1.4-1.4a.5.5 0 1 0-.7.7L6.9 10.1c.2.2.5.2.7 0z" />
  </svg>
);

/** Fluent `copy_16_regular`. */
export const FluentCopyIcon = () => (
  <svg {...base}>
    <path d="M5 6H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1h1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM8 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
  </svg>
);

/** Fluent `document_16_filled`. */
export const FluentDocumentFilledIcon = () => (
  <svg {...base}>
    <path d="M8 1v3.5C8 5.33 8.67 6 9.5 6H13v7.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-11C3 1.67 3.67 1 4.5 1zm1 .25V4.5c0 .28.22.5.5.5h3.25z" />
  </svg>
);

/** Fluent `folder_16_filled`. */
export const FluentFolderFilledIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8 3.79 5.94 5.85a.5.5 0 0 1-.35.15H1zM1 7v4.5A2.5 2.5 0 0 0 3.5 14h9a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 12.5 4H9.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7z" />
  </svg>
);

/** Fluent `copy_16_filled`. */
export const FluentCopyFilledIcon = () => (
  <svg {...base}>
    <path d="M5 9a3 3 0 0 0 3 3h2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z" />
  </svg>
);

/** Fluent `delete_16_filled`. */
export const FluentTrashFilledIcon = () => (
  <svg {...base}>
    <path d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.56l-1.2 8.84A2.5 2.5 0 0 1 9.74 15h-3.5a2.5 2.5 0 0 1-2.48-2.16L2.57 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5" />
  </svg>
);

/** Fluent `warning_16_filled`. */
export const FluentWarningFilledIcon = () => (
  <svg {...base}>
    <path d="M5.82 2.28a2.5 2.5 0 0 1 4.36 0l4.5 8A2.5 2.5 0 0 1 12.5 14h-9a2.5 2.5 0 0 1-2.18-3.72zM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5M8 5a.5.5 0 0 0-.5.5V8a.5.5 0 0 0 1 0V5.5A.5.5 0 0 0 8 5" />
  </svg>
);

/** Fluent `arrow_counterclockwise_16_regular`. */
export const FluentResetIcon = () => (
  <svg {...base}>
    <path d="M13 8a5 5 0 0 0-9-3h2a.5.5 0 1 1 0 1H2.99a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v1.53A5.99 5.99 0 0 1 14 8a6 6 0 0 1-11.97.54.5.5 0 0 1 1-.08A5 5 0 0 0 13 8" />
  </svg>
);

/** Fluent `chevron_left_16_regular`. */
export const FluentChevronLeftIcon = () => (
  <svg {...base}>
    <path d="M10.35 3.15c.2.2.2.5 0 .7L6.21 8l4.14 4.15a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5c.2-.2.5-.2.7 0" />
  </svg>
);

/** Fluent `chevron_right_16_regular`. */
export const FluentChevronRightIcon = () => (
  <svg {...base}>
    <path d="M5.65 3.15a.5.5 0 0 0 0 .7L9.79 8l-4.14 4.15a.5.5 0 0 0 .7.7l4.5-4.5a.5.5 0 0 0 0-.7l-4.5-4.5a.5.5 0 0 0-.7 0" />
  </svg>
);

/** Fluent `chevron_up_16_regular`. */
export const FluentChevronUpIcon = () => (
  <svg {...base}>
    <path d="M3.15 10.35c.2.2.5.2.7 0L8 6.21l4.15 4.14a.5.5 0 0 0 .7-.7l-4.5-4.5a.5.5 0 0 0-.7 0l-4.5 4.5a.5.5 0 0 0 0 .7" />
  </svg>
);

/** Fluent `arrow_left_16_regular`. */
export const FluentArrowLeftIcon = () => (
  <svg {...base}>
    <path d="M13.5 8.5a.5.5 0 0 0 0-1H3.8l4.03-3.63a.5.5 0 1 0-.66-.74l-5 4.5a.5.5 0 0 0 0 .74l5 4.5a.5.5 0 1 0 .66-.74L3.8 8.5z" />
  </svg>
);

/** Fluent `arrow_down_16_regular`. */
export const FluentArrowDownIcon = () => (
  <svg {...base}>
    <path d="M8.5 2.5a.5.5 0 1 0-1 0v9.7L3.87 8.17a.5.5 0 1 0-.74.66l4.5 5a.5.5 0 0 0 .74 0l4.5-5a.5.5 0 0 0-.74-.66L8.5 12.2z" />
  </svg>
);

/** Fluent `play_16_filled`. */
export const FluentPlayFilledIcon = () => (
  <svg {...base}>
    <path d="M6.24 2.2A1.5 1.5 0 0 0 4 3.5v9a1.5 1.5 0 0 0 2.24 1.3l8-4.5a1.5 1.5 0 0 0 0-2.6z" />
  </svg>
);

/** Fluent `pause_16_filled`. */
export const FluentPauseFilledIcon = () => (
  <svg {...base}>
    <path d="M3.75 2C2.78 2 2 2.78 2 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5C6.22 14 7 13.22 7 12.25v-8.5C7 2.78 6.22 2 5.25 2zm7 0C9.78 2 9 2.78 9 3.75v8.5c0 .97.78 1.75 1.75 1.75h1.5c.97 0 1.75-.78 1.75-1.75v-8.5C14 2.78 13.22 2 12.25 2z" />
  </svg>
);

/** Fluent `next_16_filled`. */
export const FluentNextFilledIcon = () => (
  <svg {...base}>
    <path d="M2 3a1 1 0 0 1 1.58-.81l7 4.96a1 1 0 0 1 0 1.63l-7 5.03a1 1 0 0 1-1.58-.8zm12-.5a.5.5 0 1 0-1 0v11a.5.5 0 0 0 1 0z" />
  </svg>
);

/** Fluent `previous_16_filled`. */
export const FluentPreviousFilledIcon = () => (
  <svg {...base}>
    <path d="M14 3a1 1 0 0 0-1.58-.81l-7 4.96a1 1 0 0 0 0 1.63l7 5.03a1 1 0 0 0 1.58-.8zM2 2.5a.5.5 0 0 1 1 0v11a.5.5 0 0 1-1 0z" />
  </svg>
);

/** Fluent `weather_sunny_16_regular`. */
export const FluentWeatherSunnyIcon = () => (
  <svg {...base}>
    <path d="M8 1c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4m6.5-1.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM8 13c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5M2.5 8.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zm.65-5.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 9.7a.5.5 0 1 1-.7-.7l1-1a.5.5 0 0 1 .7.7zm9-9.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 9.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z" />
  </svg>
);

/** Fluent `weather_partly_cloudy_day_16_regular`. */
export const FluentWeatherPartlyCloudyIcon = () => (
  <svg {...base}>
    <path d="M9 7a2.5 2.5 0 0 0-2.5 2.5v.5h-1a1.5 1.5 0 0 0 0 3h7a1.5 1.5 0 0 0 0-3h-1v-.5A2.5 2.5 0 0 0 9 7M5.53 9a3.5 3.5 0 0 1 6.93 0h.04a2.5 2.5 0 0 1 0 5h-7a2.5 2.5 0 0 1 0-5zM8.8 2.82a.5.5 0 1 0-.89-.47l-.42.8a.5.5 0 0 0 .88.47zM5 2.07a.5.5 0 1 0-.95.3l.26.87a.5.5 0 0 0 .96-.3zM6 4a3 3 0 0 1 2.29 1.06q-.6.1-1.11.32a2 2 0 0 0-2.8 2.8q-.48.15-.9.46A3 3 0 0 1 6 4m-4.18.21a.5.5 0 1 0-.47.89l.8.42a.5.5 0 0 0 .47-.88zm.42 4.47a.5.5 0 0 0-.3-.96L1.07 8a.5.5 0 1 0 .3.95z" />
  </svg>
);

/** Fluent `arrow_trending_16_regular`. */
export const FluentArrowTrendingIcon = () => (
  <svg {...base}>
    <path d="M8.5 4h5.04l.09.02.06.02.06.03.06.04.06.05.04.05.04.06.03.08.01.04.01.09V9.5a.5.5 0 0 1-.99.09V5.7l-5.15 5.15a.5.5 0 0 1-.64.06l-.07-.06L5.5 9.21l-2.65 2.64a.5.5 0 0 1-.76-.63l.06-.07 3-3a.5.5 0 0 1 .63-.06l.07.06L7.5 9.79 12.3 5H8.5a.5.5 0 0 1-.5-.41V4.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `arrow_up_right_16_regular`. */
export const FluentArrowUpRightIcon = () => (
  <svg {...base}>
    <path d="M7.5 3a.5.5 0 0 1 0-1h6c.28 0 .5.22.5.5v6a.5.5 0 0 1-1 0V3.7L2.85 13.86a.5.5 0 0 1-.7-.7L12.29 3z" />
  </svg>
);

/** Fluent `heart_16_regular`. */
export const FluentHeartIcon = () => (
  <svg {...base}>
    <path d="M7.54 3.95a3.25 3.25 0 0 0-4.6-.01 3.25 3.25 0 0 0 .02 4.6l4.7 4.7c.2.2.52.2.71 0l4.69-4.68a3.25 3.25 0 0 0-4.61-4.6l-.46.44zm4.8 3.9-4.32 4.33-4.36-4.36a2.25 2.25 0 0 1 0-3.18c.87-.87 2.3-.87 3.17.01l.81.81c.2.2.53.2.72 0l.79-.8c.88-.88 2.3-.87 3.19.01.88.88.88 2.3 0 3.18" />
  </svg>
);

/** Fluent `align_right_16_regular`. */
export const FluentAlignRightIcon = () => (
  <svg {...base}>
    <path d="M14 1.5a.5.5 0 0 0-1 0v13a.5.5 0 0 0 1 0zm-3.75.5c.97 0 1.75.78 1.75 1.75v1.5C12 6.22 11.22 7 10.25 7h-6.5C2.78 7 2 6.22 2 5.25v-1.5C2 2.78 2.78 2 3.75 2zM11 3.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h6.5c.41 0 .75-.34.75-.75zM10.25 9c.97 0 1.75.78 1.75 1.75v1.5c0 .97-.78 1.75-1.75 1.75h-4.5C4.78 14 4 13.22 4 12.25v-1.5C4 9.78 4.78 9 5.75 9zm.75 1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h4.5c.41 0 .75-.34.75-.75z" />
  </svg>
);

/** Fluent `align_center_horizontal_16_regular`. */
export const FluentAlignCenterIcon = () => (
  <svg {...base}>
    <path d="M15 7.5a.5.5 0 0 1-.5.5H14v1.25c0 .97-.78 1.75-1.75 1.75h-1.5C9.78 11 9 10.22 9 9.25V8H7v2.25C7 11.22 6.22 12 5.25 12h-1.5C2.78 12 2 11.22 2 10.25V8h-.5a.5.5 0 0 1 0-1H2V4.75C2 3.78 2.78 3 3.75 3h1.5C6.22 3 7 3.78 7 4.75V7h2V5.75C9 4.78 9.78 4 10.75 4h1.5c.97 0 1.75.78 1.75 1.75V7h.5c.28 0 .5.22.5.5M3 10.25c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-5.5A.75.75 0 0 0 5.25 4h-1.5a.75.75 0 0 0-.75.75zm7-1c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-3.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75z" />
  </svg>
);

/** Fluent `number_symbol_16_regular`. */
export const FluentFrameIcon = () => (
  <svg {...base}>
    <path d="M7 2.6a.5.5 0 1 0-1-.19L5.55 5H3.5a.5.5 0 0 0 0 1h1.86l-.73 4H2.5a.5.5 0 0 0 0 1h1.95L4 13.41a.5.5 0 0 0 .98.18L5.46 11h3.98l-.43 2.4a.5.5 0 0 0 .98.19l.47-2.59h2.04a.5.5 0 0 0 0-1h-1.86l.73-4h2.13a.5.5 0 1 0 0-1h-1.95L12 2.6a.5.5 0 1 0-.98-.19l-.47 2.6H6.55zM6.36 6h3.99l-.73 4H5.64z" />
  </svg>
);

/** Fluent `square_16_regular`. */
export const FluentRectangleIcon = () => (
  <svg {...base}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `pen_16_regular`. */
export const FluentPenIcon = () => (
  <svg {...base}>
    <path d="M13.44 2.56a1.9 1.9 0 0 0-2.7 0l-7.4 7.4q-.27.27-.4.64l-.91 2.74a.5.5 0 0 0 .63.63l2.74-.91q.36-.12.65-.4L12 6.71l.26.26c.3.3.3.77 0 1.06l-1.11 1.12a.5.5 0 1 0 .7.7l1.12-1.11c.68-.69.68-1.8 0-2.48L12.71 6l.73-.73c.75-.75.75-1.96 0-2.7m-1.78 3.07-.03.03-6.3 6.3a1 1 0 0 1-.25.15l-1.79.6.6-1.8q.04-.14.16-.25l7.39-7.4a.91.91 0 1 1 1.3 1.3z" />
  </svg>
);

/** Fluent `text_t_16_regular`. */
export const FluentTextTIcon = () => (
  <svg {...base}>
    <path d="M3 2.5c0-.28.22-.5.5-.5h8c.28 0 .5.22.5.5v2a.5.5 0 0 1-1 0V3H8v10h1a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1h1V3H4v1.5a.5.5 0 0 1-1 0z" />
  </svg>
);

/** Fluent `comment_16_regular`. */
export const FluentCommentIcon = () => (
  <svg {...base}>
    <path d="M1 4.5A2.5 2.5 0 0 1 3.5 2h9A2.5 2.5 0 0 1 15 4.5v5a2.5 2.5 0 0 1-2.5 2.5H8.69l-3.06 2.68A.98.98 0 0 1 4 13.94V12h-.5A2.5 2.5 0 0 1 1 9.5zM3.5 3C2.67 3 2 3.67 2 4.5v5c0 .83.67 1.5 1.5 1.5H5v2.9L8.31 11h4.19c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

/** Fluent `design_ideas_16_regular`. */
export const FluentDesignIcon = () => (
  <svg {...base}>
    <path d="M4.23 6.5c.29.29.46.68.56 1.06.21.76.21 1.68.21 2.4V10c0 2.06-.39 3.28-.82 4q-.34.54-.64.75a2 2 0 0 1-.33.2S3.08 15 3 15a1 1 0 0 1-.3-.09l-.24-.16a3 3 0 0 1-.64-.74C1.4 13.28 1 12.06 1 10v-.04c0-.72 0-1.64.2-2.4.11-.38.28-.77.57-1.07A2.7 2.7 0 0 1 1 4.5a4.73 4.73 0 0 1 .69-2.1A4 4 0 0 1 2.93 1.1l.03-.02h.01a.5.5 0 0 1 .73.63l-.01.1c0 .06.01.18.16.33l.2.18.16.16q.2.18.4.45c.25.38.39.86.39 1.56 0 .83-.3 1.54-.77 2M3 7q-.36.01-.51.19-.2.19-.32.63A9 9 0 0 0 2 10c0 1.94.36 2.97.68 3.5q.18.29.32.4.14-.11.32-.4c.32-.53.68-1.56.68-3.5 0-.76 0-1.56-.17-2.18q-.13-.44-.32-.63A.7.7 0 0 0 3 7M2 4.5C2 5.57 2.62 6 3 6s1-.43 1-1.5c0-.55-.1-.82-.23-1q-.09-.15-.25-.3l-.12-.1-.25-.25a2 2 0 0 1-.28-.36 3 3 0 0 0-.34.44A4 4 0 0 0 2 4.5m5 6.47q-.53-.06-1.02-.23L6 9.96v-.3q.47.22 1 .3V8c0-1.1.9-2 2-2h1.96A3.5 3.5 0 0 0 5.9 3.4a3 3 0 0 0-.39-.94Q6.41 2 7.5 2a4.5 4.5 0 0 1 4.47 4H13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM11.97 7A4.5 4.5 0 0 1 8 10.97V12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1 0H9a1 1 0 0 0-1 1v1.96A3.5 3.5 0 0 0 10.96 7" />
  </svg>
);

/** Fluent `play_16_regular`. */
export const FluentPlayIcon = () => (
  <svg {...base}>
    <path d="M5.75 3.06A.5.5 0 0 0 5 3.5v9c0 .38.41.62.75.44l8-4.5a.5.5 0 0 0 0-.88zM4 3.5a1.5 1.5 0 0 1 2.24-1.3l8 4.5a1.5 1.5 0 0 1 0 2.6l-8 4.5A1.5 1.5 0 0 1 4 12.5z" />
  </svg>
);

/** Fluent `text_bold_16_regular`. */
export const FluentBoldIcon = () => (
  <svg {...base}>
    <path d="M4 3.1C4 2.5 4.5 2 5.1 2h3c2.1 0 3.4 1.4 3.4 3.4 0 .9-.3 2-.7 2.6.8.6 1.4 1.2 1.4 2.5 0 2.7-2.1 3.5-3.6 3.5H5.1c-.6 0-1.1-.5-1.1-1.1zM6 9v3h2.4c.7 0 1.5-.5 1.5-1.5S9.1 9 8.4 9zm0-2h2.2c.9 0 1.5-.7 1.5-1.5S9.1 4 8.3 4H6z" />
  </svg>
);

/** Fluent `text_strikethrough_16_regular`. */
export const FluentStrikethroughIcon = () => (
  <svg {...base}>
    <path d="M5 5.1q.01-.84.84-1.46C6.39 3.25 7.19 3 8.1 3c1.3 0 2.38.56 2.76 1.24a.5.5 0 0 0 .88-.48C11.12 2.64 9.6 2 8.1 2c-1.09 0-2.1.3-2.84.83A2.8 2.8 0 0 0 4 5.1c0 .72.3 1.37.79 1.9H6.5C5.55 6.6 5 5.83 5 5.1M13.5 8a.5.5 0 0 1 0 1h-2.34c.52.5.84 1.15.84 1.9 0 .9-.51 1.69-1.26 2.23C10 13.67 9 14 7.9 14c-1.62 0-3-.65-3.72-1.72a.5.5 0 0 1 .84-.56C5.5 12.45 6.52 13 7.9 13c.9 0 1.7-.27 2.25-.68.56-.4.85-.92.85-1.42 0-.78-.63-1.53-1.78-1.9H2.5a.5.5 0 0 1 0-1z" />
  </svg>
);

/** Fluent `text_align_left_16_regular`. */
export const FluentTextAlignLeftIcon = () => (
  <svg {...base}>
    <path d="M1 3.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5m0 4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `text_align_center_16_regular`. */
export const FluentTextAlignCenterIcon = () => (
  <svg {...base}>
    <path d="M3 3.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-2 4c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5m4 4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `text_align_right_16_regular`. */
export const FluentTextAlignRightIcon = () => (
  <svg {...base}>
    <path d="M5 3.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-4 4c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5m8 4c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `arrow_expand_16_regular`. */
export const FluentExpandIcon = () => (
  <svg {...base}>
    <path d="M2 2.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1H3.7l2.65 2.65a.5.5 0 0 1-.7.7L3 3.71V5.5a.5.5 0 0 1-1 0zM13.5 2c.28 0 .5.22.5.5v3a.5.5 0 0 1-1 0V3.7l-2.65 2.65a.5.5 0 0 1-.7-.7L12.29 3H10.5a.5.5 0 0 1 0-1zm0 12a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.8l-2.65-2.65a.5.5 0 1 0-.7.7L12.29 13H10.5a.5.5 0 0 0 0 1zm-11 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v1.8l2.65-2.65a.5.5 0 0 1 .7.7L3.71 13H5.5a.5.5 0 0 1 0 1z" />
  </svg>
);

/** Fluent `arrow_expand_16_filled`. */
export const FluentExpandFilledIcon = () => (
  <svg {...base}>
    <path d="M5.25 3.5h-.69l1.72 1.72a.75.75 0 0 1-1.06 1.06L3.5 4.56v.69a.75.75 0 0 1-1.5 0v-2.5c0-.41.34-.75.75-.75h2.5a.75.75 0 0 1 0 1.5M3.5 11.44l1.72-1.72a.75.75 0 1 1 1.06 1.06L4.56 12.5h.69a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0zM13.25 10a.75.75 0 0 0-.75.75v.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l1.72 1.72h-.69a.75.75 0 0 0 0 1.5h2.5c.41 0 .75-.34.75-.75v-2.5a.75.75 0 0 0-.75-.75m-2.5-8h2.5c.41 0 .75.34.75.75v2.5a.75.75 0 0 1-1.5 0v-.69l-1.72 1.72a.74.74 0 0 1-1.06 0 .75.75 0 0 1 0-1.06l1.72-1.72h-.69a.75.75 0 0 1 0-1.5" />
  </svg>
);

/** Fluent `panel_left_16_regular`. */
export const FluentPanelLeftIcon = () => (
  <svg {...base}>
    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h7A2.5 2.5 0 0 1 14 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 10.5zM7 4v8h4.5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5zM6 4H4.5C3.67 4 3 4.67 3 5.5v5c0 .83.67 1.5 1.5 1.5H6z" />
  </svg>
);

/** Fluent `panel_left_16_filled`. */
export const FluentPanelLeftFilledIcon = () => (
  <svg {...base}>
    <path d="M4.5 3A2.5 2.5 0 0 0 2 5.5v5A2.5 2.5 0 0 0 4.5 13h7a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 11.5 3zM7 4h4.5c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H7z" />
  </svg>
);

/** Fluent `panel_right_16_regular`. */
export const FluentPanelRightIcon = () => (
  <svg {...base}>
    <path d="M14 5.5A2.5 2.5 0 0 0 11.5 3h-7A2.5 2.5 0 0 0 2 5.5v5A2.5 2.5 0 0 0 4.5 13h7a2.5 2.5 0 0 0 2.5-2.5zM9 4v8H4.5A1.5 1.5 0 0 1 3 10.5v-5C3 4.67 3.67 4 4.5 4zm1 0h1.5c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H10z" />
  </svg>
);

/** Fluent `panel_right_16_filled`. */
export const FluentPanelRightFilledIcon = () => (
  <svg {...base}>
    <path d="M11.5 3A2.5 2.5 0 0 1 14 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 10.5v-5A2.5 2.5 0 0 1 4.5 3zM9 4H4.5C3.67 4 3 4.67 3 5.5v5c0 .83.67 1.5 1.5 1.5H9z" />
  </svg>
);

/** Fluent `book_open_16_regular`. */
export const FluentBookIcon = () => (
  <svg {...base}>
    <path d="M2.5 2C1.67 2 1 2.67 1 3.5v9c0 .83.67 1.5 1.5 1.5H6c.82 0 1.54-.4 2-1 .46.6 1.18 1 2 1h3.5c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5H10c-.82 0-1.54.4-2 1a2.5 2.5 0 0 0-2-1zm5 2.5v7c0 .83-.67 1.5-1.5 1.5H2.5a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5H6c.83 0 1.5.67 1.5 1.5m1 7v-7c0-.83.67-1.5 1.5-1.5h3.5c.28 0 .5.22.5.5v9a.5.5 0 0 1-.5.5H10a1.5 1.5 0 0 1-1.5-1.5" />
  </svg>
);

/** Fluent `book_open_16_filled`. */
export const FluentBookFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 2C1.78 2 1 2.78 1 3.75v8.5c0 .97.78 1.75 1.75 1.75H6c.79 0 1.5-.33 2-.86.5.53 1.21.86 2 .86h3.25c.97 0 1.75-.78 1.75-1.75v-8.5C15 2.78 14.22 2 13.25 2H10c-.79 0-1.5.33-2 .86A2.7 2.7 0 0 0 6 2zm4.5 2.75v6.5c0 .69-.56 1.25-1.25 1.25H2.75a.25.25 0 0 1-.25-.25v-8.5c0-.14.11-.25.25-.25H6c.69 0 1.25.56 1.25 1.25m1.5 6.5v-6.5c0-.69.56-1.25 1.25-1.25h3.25c.14 0 .25.11.25.25v8.5q-.02.23-.25.25H10c-.69 0-1.25-.56-1.25-1.25" />
  </svg>
);

/** Fluent `options_16_regular`. */
export const FluentOptionsIcon = () => (
  <svg {...base}>
    <path d="M6 9.5A2 2 0 0 1 7.94 11h5.56a.5.5 0 0 1 .09 1H7.94a2 2 0 0 1-3.88 0H2.5a.5.5 0 0 1-.09-1h1.65A2 2 0 0 1 6 9.5m0 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m4-8A2 2 0 0 1 11.94 4h1.56a.5.5 0 0 1 .09 1h-1.65a2 2 0 0 1-3.88 0H2.5a.5.5 0 0 1-.09-1h5.65A2 2 0 0 1 10 2.5m0 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);

/** Fluent `options_16_filled`. */
export const FluentOptionsFilledIcon = () => (
  <svg {...base}>
    <path d="M6 9.5A2 2 0 0 1 7.94 11h5.56a.5.5 0 0 1 .09 1H7.94a2 2 0 0 1-3.88 0H2.5a.5.5 0 0 1-.09-1h1.65A2 2 0 0 1 6 9.5m4-7A2 2 0 0 1 11.94 4h1.56a.5.5 0 0 1 .09 1h-1.65a2 2 0 0 1-3.88 0H2.5a.5.5 0 0 1-.09-1h5.65A2 2 0 0 1 10 2.5" />
  </svg>
);

/** Fluent `color_16_regular`. */
export const FluentColorIcon = () => (
  <svg {...base}>
    <path d="M7.5 5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M11.5 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M11 9.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M8 2a6 6 0 0 0-6 6c0 1.1.9 2 2 2 .7 0 1.09-.38 1.34-.63l.01-.02C5.6 9.11 5.72 9 6 9a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3c1.33 0 2.35-.75 3.02-1.85.65-1.1.98-2.57.98-4.15a6 6 0 0 0-6-6M3 8a5 5 0 0 1 10 0c0 1.46-.3 2.74-.84 3.63Q11.36 12.98 10 13a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2c-.7 0-1.09.38-1.34.63l-.01.02C4.4 8.89 4.28 9 4 9a1 1 0 0 1-1-1" />
  </svg>
);

/** Fluent `color_16_filled`. */
export const FluentColorFilledIcon = () => (
  <svg {...base}>
    <path d="M2 8a6 6 0 1 1 12 0c0 1.58-.33 3.05-.98 4.15C12.35 13.25 11.33 14 10 14a3 3 0 0 1-3-3v-1a1 1 0 0 0-1-1c-.28 0-.4.1-.65.35l-.01.02c-.25.25-.63.63-1.34.63a2 2 0 0 1-2-2m5.5-2.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M11.5 7a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M11 9.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-.5 1.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0" />
  </svg>
);

/** Fluent `text_font_16_regular`. */
export const FluentTextIcon = () => (
  <svg {...base}>
    <path d="M4.75 2c.2 0 .4.13.47.32l1.73 4.61-.55 1.4-.3-.83H3.4l-.44 1.18a.5.5 0 0 1-.94-.36l2.25-6A.5.5 0 0 1 4.75 2m-.97 4.5h1.94l-.97-2.58zM6.7 10.3v.03L5.65 13H5.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-.77l.78-2h3.98l.78 2h-.77a.5.5 0 1 0 0 1h2.01a.5.5 0 0 0 0-1h-.17L9.97 4.32a.5.5 0 0 0-.94 0zm4.4-.3H7.9l1.6-4.13z" />
  </svg>
);

/** Fluent `text_font_16_filled`. */
export const FluentTextFilledIcon = () => (
  <svg {...base}>
    <path d="M4.88 2.02c.3 0 .59.19.7.48l1.56 4.04-.8 2.07-.04-.07-.3-.79H3.76l-.3.79A.75.75 0 1 1 2.05 8l2.12-5.5a.8.8 0 0 1 .7-.48m-.54 4.23h1.08l-.54-1.4zm5.86-1.76a.75.75 0 0 0-1.4 0L5.73 12.5a.75.75 0 0 0 .02 1.5h1.5a.75.75 0 0 0 .09-1.5l.38-1h3.56l.38 1a.75.75 0 0 0 .1 1.5h1.5a.75.75 0 0 0 0-1.5l-.74-1.96-.05-.12zm.5 5.51H8.3l1.2-3.15z" />
  </svg>
);

/** Fluent `shapes_16_regular`. */
export const FluentShapesIcon = () => (
  <svg {...base}>
    <path d="M5.5 2A3.5 3.5 0 0 0 5 8.96v1.01A4.5 4.5 0 1 1 9.97 5h-1A3.5 3.5 0 0 0 5.5 2m3 4A2.5 2.5 0 0 0 6 8.5v4A2.5 2.5 0 0 0 8.5 15h4a2.5 2.5 0 0 0 2.5-2.5v-4A2.5 2.5 0 0 0 12.5 6zM7 8.5C7 7.67 7.67 7 8.5 7h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 7 12.5z" />
  </svg>
);

/** Fluent `shapes_16_filled`. */
export const FluentShapesFilledIcon = () => (
  <svg {...base}>
    <path d="M1 5.5A4.5 4.5 0 0 1 9.97 5H8.5A3.5 3.5 0 0 0 5 8.5v1.47A4.5 4.5 0 0 1 1 5.5m7.5.5A2.5 2.5 0 0 0 6 8.5v4A2.5 2.5 0 0 0 8.5 15h4a2.5 2.5 0 0 0 2.5-2.5v-4A2.5 2.5 0 0 0 12.5 6z" />
  </svg>
);

/** Fluent `line_horizontal_4_16_regular`. */
export const FluentListIcon = () => (
  <svg {...base}>
    <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zM2 9.5c0-.28.22-.5.5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1z" />
  </svg>
);

/** Fluent `line_horizontal_4_16_filled`. */
export const FluentListFilledIcon = () => (
  <svg {...base}>
    <path d="M2.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zm0 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zM2 9.75c0-.41.34-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75M2.75 12a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/** Fluent `square_hint_16_regular`. */
export const FluentSquareDashedIcon = () => (
  <svg {...base}>
    <path d="M9.5 2.5A.5.5 0 0 0 9 2H7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5m1.5 0c0 .28.22.5.5.5.83 0 1.5.67 1.5 1.5a.5.5 0 0 0 1 0A2.5 2.5 0 0 0 11.5 2a.5.5 0 0 0-.5.5M14 7a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zm0 4.5a.5.5 0 0 0-1 0c0 .83-.67 1.5-1.5 1.5a.5.5 0 0 0 0 1 2.5 2.5 0 0 0 2.5-2.5m-7.5 2c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5M5 2.5a.5.5 0 0 0-.5-.5A2.5 2.5 0 0 0 2 4.5a.5.5 0 0 0 1 0C3 3.67 3.67 3 4.5 3a.5.5 0 0 0 .5-.5M4.5 13a.5.5 0 0 1 0 1A2.5 2.5 0 0 1 2 11.5a.5.5 0 0 1 1 0c0 .83.67 1.5 1.5 1.5M3 9a.5.5 0 0 1-1 0V7a.5.5 0 0 1 1 0z" />
  </svg>
);

/** Fluent `square_hint_16_filled`. */
export const FluentSquareDashedFilledIcon = () => (
  <svg {...base}>
    <path d="M7.25 2a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zM3.5 7.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 1 0 1.5 0zm9.75-.75c.41 0 .75.34.75.75v1.5a.75.75 0 0 1-1.5 0v-1.5c0-.41.34-.75.75-.75m-6 7.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5zM11 2.75c0-.41.34-.75.75-.75C12.99 2 14 3 14 4.25a.75.75 0 0 1-1.5 0 .75.75 0 0 0-.75-.75.75.75 0 0 1-.75-.75M11.75 14a.75.75 0 0 1 0-1.5c.41 0 .75-.34.75-.75a.75.75 0 0 1 1.5 0c0 1.24-1 2.25-2.25 2.25M5 2.75A.75.75 0 0 0 4.25 2C3.01 2 2 3 2 4.25a.75.75 0 0 0 1.5 0c0-.41.34-.75.75-.75S5 3.16 5 2.75M4.25 14a.75.75 0 0 0 0-1.5.75.75 0 0 1-.75-.75.75.75 0 0 0-1.5 0C2 12.99 3 14 4.25 14" />
  </svg>
);

/** Fluent `layer_diagonal_16_regular`. */
export const FluentLayersIcon = () => (
  <svg {...base}>
    <path d="M7.3 2.04c.33-.14.7.1.7.46v.22l.95-.44.03-.02a1.5 1.5 0 0 0-2.07-1.14L2.5 3.01A2.5 2.5 0 0 0 1 5.3v4.2a1.5 1.5 0 0 0 2 1.4V9.83l-.3.13A.5.5 0 0 1 2 9.5V5.3c0-.6.36-1.14.9-1.37zm3 2c.33-.14.7.1.7.46v.35l1-.42a1.5 1.5 0 0 0-2.1-1.3l-5 2.14c-.54.23-.9.77-.9 1.37v4.86a1.5 1.5 0 0 0 2 1.41v-1.08l-.3.13a.5.5 0 0 1-.7-.46V6.64c0-.2.12-.38.3-.46zM15 6.5a1.5 1.5 0 0 0-2.1-1.38l-5 2.15c-.54.23-.9.77-.9 1.37v4.86a1.5 1.5 0 0 0 2.1 1.37l5-2.17c.55-.23.9-.77.9-1.37zm-1.7-.46c.33-.14.7.1.7.46v4.83a.5.5 0 0 1-.3.46l-5 2.17a.5.5 0 0 1-.7-.46V8.64c0-.2.12-.38.3-.46z" />
  </svg>
);

/** Fluent `layer_diagonal_16_filled`. */
export const FluentLayersFilledIcon = () => (
  <svg {...base}>
    <path d="M3 10.92v-4.3c0-.97.57-1.86 1.45-2.26l4.5-2.08.03-.02a1.5 1.5 0 0 0-2.07-1.14L2.5 3.01A2.5 2.5 0 0 0 1 5.3v4.2a1.5 1.5 0 0 0 2 1.4m3 2V8.63c0-1 .6-1.9 1.52-2.3L12 4.44a1.5 1.5 0 0 0-2.1-1.3l-5 2.14c-.54.23-.9.77-.9 1.37v4.86a1.5 1.5 0 0 0 2 1.41m6.9-7.8c1-.42 2.1.3 2.1 1.38v4.83c0 .6-.35 1.14-.9 1.37l-5 2.17c-1 .43-2.1-.3-2.1-1.37V8.64c0-.6.36-1.14.9-1.37z" />
  </svg>
);

/** Fluent `flash_16_regular`. */
export const FluentFlashIcon = () => (
  <svg {...base}>
    <path d="M4.91 1.71A1 1 0 0 1 5.87 1h4.4a1 1 0 0 1 .94 1.35L10.22 5h2.03c.63 0 .98.73.59 1.22l-6.6 8.3c-.86 1.07-2.57.18-2.19-1.13L5.33 9H3.75a.75.75 0 0 1-.72-.96zm5.37.29h-4.4l-1.8 6H6a.5.5 0 0 1 .48.64l-1.47 5.03a.2.2 0 0 0 .01.17q.03.08.12.12t.16.03.15-.1L11.73 6H9.5a.5.5 0 0 1-.47-.68z" />
  </svg>
);

/** Fluent `flash_16_filled`. */
export const FluentFlashFilledIcon = () => (
  <svg {...base}>
    <path d="M5.87 1a1 1 0 0 0-.96.71L3.03 8.04c-.14.48.22.96.72.96h1.58l-1.28 4.39c-.38 1.31 1.33 2.2 2.18 1.13l6.6-8.3A.75.75 0 0 0 12.26 5h-2.03l1-2.65A1 1 0 0 0 10.27 1z" />
  </svg>
);

/** Area `trending-up` (the demo swap). */
export const TrendingIcon = (props: PilotIconProps) => <PilotTrendingUpIcon {...props} />;

/** Area `arrow-up-right` (the demo swap). */
export const ArrowUpRightIcon = (props: PilotIconProps) => <PilotArrowUpRightIcon {...props} />;

/** Area `bold` (the demo swap). */
export const BoldIcon = (props: PilotIconProps) => <PilotBoldIcon {...props} />;

/** Area `italic` (the demo swap). */
export const ItalicIcon = (props: PilotIconProps) => <PilotItalicIcon {...props} />;

/** Area `underline` (the demo swap). */
export const UnderlineIcon = (props: PilotIconProps) => <PilotUnderlineIcon {...props} />;

/** Area `strikethrough` (the demo swap). */
export const StrikethroughIcon = (props: PilotIconProps) => <PilotStrikethroughIcon {...props} />;

/** Area `chevron-left` (the demo swap). */
export const ChevronLeftIcon = (props: PilotIconProps) => <PilotChevronLeftIcon {...props} />;

/** Area `chevron-right` (the demo swap). */
export const ChevronRightIcon = (props: PilotIconProps) => <PilotChevronRightIcon {...props} />;

/** Area `chat` (the demo swap). */
export const CommentIcon = (props: PilotIconProps) => <PilotChatIcon {...props} />;

/** Area `copy` (the demo swap). */
export const CopyIcon = (props: PilotIconProps) => <PilotCopyIcon {...props} />;

/** Area `pen-tool` (the demo swap). */
export const DesignIcon = (props: PilotIconProps) => <PilotPenToolIcon {...props} />;

/** Area `frame` (the demo swap). */
export const FrameIcon = (props: PilotIconProps) => <PilotFrameIcon {...props} />;

/** Area `heart` (the demo swap). */
export const HeartIcon = (props: PilotIconProps) => <PilotHeartIcon {...props} />;

/** Area `skip-forward:filled` (the demo swap). */
export const NextFilledIcon = (props: PilotIconProps) => <PilotSkipForwardFilledIcon {...props} />;

/** Area `pause:filled` (the demo swap). */
export const PauseFilledIcon = (props: PilotIconProps) => <PilotPauseFilledIcon {...props} />;

/** Area `skip-back:filled` (the demo swap). */
export const PreviousFilledIcon = (props: PilotIconProps) => <PilotSkipBackFilledIcon {...props} />;

/** Area `panel-left` (the demo swap). */
export const PanelLeftIcon = (props: PilotIconProps) => <PilotPanelLeftIcon {...props} />;

/** Area `pen-tool` (the demo swap). */
export const PenIcon = (props: PilotIconProps) => <PilotPenToolIcon {...props} />;

/** Area `play` (the demo swap). */
export const PlayIcon = (props: PilotIconProps) => <PilotPlayIcon {...props} />;

/** Area `rectangle` (the demo swap). */
export const RectangleIcon = (props: PilotIconProps) => <PilotRectangleIcon {...props} />;

/** Area `calendar` (the demo swap). */
export const CalendarIcon = (props: PilotIconProps) => <PilotCalendarIcon {...props} />;

/** Area `code` (the demo swap). */
export const CodeIcon = (props: PilotIconProps) => <PilotCodeIcon {...props} />;

/** Area `paintbrush` (the demo swap). */
export const PaintbrushIcon = (props: PilotIconProps) => <PilotPaintbrushIcon {...props} />;

/** Area `pointer` (the demo swap). */
export const PointerIcon = (props: PilotIconProps) => <PilotPointerIcon {...props} />;

/** Area `text-align-center` (the demo swap). */
export const TextAlignCenterIcon = (props: PilotIconProps) => <PilotTextAlignCenterIcon {...props} />;

/** Area `text-align-left` (the demo swap). */
export const TextAlignLeftIcon = (props: PilotIconProps) => <PilotTextAlignLeftIcon {...props} />;

/** Area `text-align-right` (the demo swap). */
export const TextAlignRightIcon = (props: PilotIconProps) => <PilotTextAlignRightIcon {...props} />;

/** Area `text` (the demo swap). */
export const TextIcon = (props: PilotIconProps) => <PilotTextIcon {...props} />;

/** Area `sun` (the demo swap). */
export const SunIcon = (props: PilotIconProps) => <PilotSunIcon {...props} />;

/*
 * Area's marks. They are stroked rather than filled, so they take their own base: the
 * fill is off and the colour rides on the stroke. Fitted to Fluent's optical weight by
 * measurement -- see the note in gen-icons.mjs.
 */
const areaBase = { ...base, fill: "none" };

/** Area `angle` (the demo swap). */
export const AngleIcon = (props: PilotIconProps) => <PilotAngleIcon {...props} />;

/** Area `aspect-ratio` (the demo swap). */
export const AspectRatioIcon = (props: PilotIconProps) => <PilotAspectRatioIcon {...props} />;

/** Area `auto-layout` (the demo swap). */
export const AutoLayoutIcon = (props: PilotIconProps) => <PilotAutoLayoutIcon {...props} />;

/** Area `auto-position`. */
export const AutoPositionIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 2.5H10.4C13.4 2.5 13.4 7 10.4 7H5.6C2.6 7 2.6 11.5 5.6 11.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 9.5 13.5 11.5 11.5 13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `menu` (the demo swap). */
export const BarsThreeIcon = (props: PilotIconProps) => <PilotMenuIcon {...props} />;

/** Area `corner-bottom-left`. */
export const CornerBottomLeftIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 2.5V9.5C2.5 11.71 4.29 13.5 6.5 13.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `corner-bottom-right`. */
export const CornerBottomRightIcon = () => (
  <svg {...areaBase}>
    <path d="M13.5 2.5V9.5C13.5 11.71 11.71 13.5 9.5 13.5H2.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `corner` (the demo swap). */
export const CornerRadiusIcon = (props: PilotIconProps) => <PilotCornerIcon {...props} />;

/** Area `corner-top-left`. */
export const CornerTopLeftIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 13.5V6.5C2.5 4.29 4.29 2.5 6.5 2.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `corner-top-right`. */
export const CornerTopRightIcon = () => (
  <svg {...areaBase}>
    <path d="M13.5 13.5V6.5C13.5 4.29 11.71 2.5 9.5 2.5H2.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `corners` (the demo swap). */
export const CornersIcon = (props: PilotIconProps) => <PilotCornersIcon {...props} />;

/** Area `dots-four` (the demo swap). */
export const DotsFourIcon = (props: PilotIconProps) => <PilotDotsFourIcon {...props} />;

/** Area `eye-off` (the demo swap). */
export const EyeSlashIcon = (props: PilotIconProps) => <PilotEyeOffIcon {...props} />;

/** Area `eye` (the demo swap). */
export const EyeIcon = (props: PilotIconProps) => <PilotEyeIcon {...props} />;

/** Area `flip` (the demo swap). */
export const FlipHorizontalIcon = (props: PilotIconProps) => <PilotFlipIcon {...props} />;

/** Area `flip-vertical` (the demo swap). */
export const FlipVerticalIcon = (props: PilotIconProps) => <PilotFlipVerticalIcon {...props} />;

/** Area `flow-free` (the demo swap). */
export const FlowFreeIcon = (props: PilotIconProps) => <PilotFlowFreeIcon {...props} />;

/** Area `flow` (the demo swap). */
export const FlowHorizontalIcon = (props: PilotIconProps) => <PilotFlowIcon {...props} />;

/** Area `flow-vertical` (the demo swap). */
export const FlowVerticalIcon = (props: PilotIconProps) => <PilotFlowVerticalIcon {...props} />;

/** Area `flow-wrap` (the demo swap). */
export const FlowWrapIcon = (props: PilotIconProps) => <PilotFlowWrapIcon {...props} />;

/** Area `gap-horizontal`. */
export const GapHorizontalIcon = () => (
  <svg {...areaBase}>
    <path d="M2.75 2.75H4C4.55 2.75 5 3.2 5 3.75V12.25C5 12.8 4.55 13.25 4 13.25H2.75" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="0.9" fill="currentColor"/>
    <path d="M13.25 2.75H12C11.45 2.75 11 3.2 11 3.75V12.25C11 12.8 11.45 13.25 12 13.25H13.25" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `gap-vertical`. */
export const GapVerticalIcon = () => (
  <svg {...areaBase}>
    <path d="M2.75 2.75V4C2.75 4.55 3.2 5 3.75 5H12.25C12.8 5 13.25 4.55 13.25 4V2.75" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="0.9" fill="currentColor"/>
    <path d="M2.75 13.25V12C2.75 11.45 3.2 11 3.75 11H12.25C12.8 11 13.25 11.45 13.25 12V13.25" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `opacity` (the demo swap). */
export const OpacityIcon = (props: PilotIconProps) => <PilotOpacityIcon {...props} />;

/** Area `padding-horizontal`. */
export const PaddingHorizontalIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M5.5 5.2V10.8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 5.2V10.8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `padding-vertical`. */
export const PaddingVerticalIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M5.2 5.5H10.8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.2 10.5H10.8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `padding`. */
export const PaddingIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M4.5 6V10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 6V10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 4.5H10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 11.5H10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `rotate` (the demo swap). */
export const RotateIcon = (props: PilotIconProps) => <PilotRotateIcon {...props} />;

/** Area `sliders` (the demo swap). */
export const SlidersIcon = (props: PilotIconProps) => <PilotSlidersIcon {...props} />;

/** Area `token` (the demo swap). */
export const TokenIcon = (props: PilotIconProps) => <PilotTokenIcon {...props} />;
