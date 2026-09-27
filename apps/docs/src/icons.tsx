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
 * Regenerate with `node scripts/gen-icons.mjs` after changing the map there.
 */
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

/** Fluent `add_16_regular`. */
export const PlusIcon = () => (
  <svg {...base}>
    <path d="M8 2c.28 0 .5.22.5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `alert_16_regular`. */
export const BellIcon = () => (
  <svg {...base}>
    <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.4l-.96 2.41A.5.5 0 0 0 3 12h3a2 2 0 1 0 4 0h3a.5.5 0 0 0 .46-.69l-.96-2.4V6.5A4.5 4.5 0 0 0 8 2m1 10a1 1 0 0 1-1 1 1 1 0 0 1-1-1zM4.5 6.5a3.5 3.5 0 1 1 7 0V9q0 .09.04.18l.72 1.82H3.74l.72-1.82L4.5 9z" />
  </svg>
);

/** Fluent `search_16_regular`. */
export const SearchIcon = () => (
  <svg {...base}>
    <path d="M11.02 11.73a5.5 5.5 0 1 1 .7-.7l3.13 3.12a.5.5 0 0 1-.7.7zM12 7.5a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0" />
  </svg>
);

/** Fluent `checkmark_16_regular`. */
export const CheckIcon = () => (
  <svg {...base}>
    <path d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02" />
  </svg>
);

/** Fluent `info_16_regular`. */
export const InfoIcon = () => (
  <svg {...base}>
    <path d="M8.5 7.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm.25-2a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8" />
  </svg>
);

/** Fluent `warning_16_regular`. */
export const AlertIcon = () => (
  <svg {...base}>
    <path d="M5.82 2.28a2.5 2.5 0 0 1 4.36 0l4.5 8A2.5 2.5 0 0 1 12.5 14h-9a2.5 2.5 0 0 1-2.18-3.72zm3.49.48a1.5 1.5 0 0 0-2.62 0l-4.5 8a1.5 1.5 0 0 0 1.31 2.24h9a1.5 1.5 0 0 0 1.3-2.23zM8 9.5A.75.75 0 1 1 8 11a.75.75 0 0 1 0-1.5M8 5c.28 0 .5.22.5.5V8a.5.5 0 0 1-1 0V5.5c0-.28.22-.5.5-.5" />
  </svg>
);

/** Fluent `arrow_right_16_regular`. */
export const ArrowIcon = () => (
  <svg {...base}>
    <path d="M2.5 7.5a.5.5 0 1 0 0 1h9.7l-4.03 3.63a.5.5 0 1 0 .66.74l5-4.5a.5.5 0 0 0 0-.74l-5-4.5a.5.5 0 0 0-.66.74L12.2 7.5z" />
  </svg>
);

/** Fluent `arrow_up_16_regular`. */
export const ArrowUpIcon = () => (
  <svg {...base}>
    <path d="M7.5 13.5a.5.5 0 0 0 1 0V3.8l3.63 4.03a.5.5 0 0 0 .74-.66l-4.5-5a.5.5 0 0 0-.74 0l-4.5 5a.5.5 0 0 0 .74.66L7.5 3.8z" />
  </svg>
);

/** Fluent `chevron_down_16_regular`. */
export const ChevronIcon = () => (
  <svg {...base}>
    <path d="M3.15 5.65c.2-.2.5-.2.7 0L8 9.79l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `folder_16_regular`. */
export const FolderIcon = () => (
  <svg {...base}>
    <path d="M2 4.5V6h3.59a.5.5 0 0 0 .35-.15L7.29 4.5 5.94 3.15A.5.5 0 0 0 5.59 3H3.5C2.67 3 2 3.67 2 4.5m-1 0A2.5 2.5 0 0 1 3.5 2h2.09c.4 0 .78.16 1.06.44L8.2 4h4.29A2.5 2.5 0 0 1 15 6.5v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5zM2 7v4.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5H8.2L6.66 6.56A1.5 1.5 0 0 1 5.59 7z" />
  </svg>
);

/** Fluent `document_16_regular`. */
export const DocumentIcon = () => (
  <svg {...base}>
    <path d="M5 1a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2V5.41c0-.4-.16-.78-.44-1.06L9.65 1.44A1.5 1.5 0 0 0 8.59 1zM4 3a1 1 0 0 1 1-1h3v2.5C8 5.33 8.67 6 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.8 2H9.5a.5.5 0 0 1-.5-.5V2.2z" />
  </svg>
);

/** Fluent `dismiss_16_regular`. */
export const DismissIcon = () => (
  <svg {...base}>
    <path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

/** Fluent `delete_16_regular`. */
export const TrashIcon = () => (
  <svg {...base}>
    <path d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.56l-1.2 8.84A2.5 2.5 0 0 1 9.74 15h-3.5a2.5 2.5 0 0 1-2.48-2.16L2.57 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5m-4.74 6.7c.1.75.74 1.3 1.49 1.3h3.5a1.5 1.5 0 0 0 1.5-1.3L12.42 4H3.57z" />
  </svg>
);

/** Fluent `link_16_regular`. */
export const LinkIcon = () => (
  <svg {...base}>
    <path d="M9.5 4h1a3.5 3.5 0 0 1 .2 7H9.5a.5.5 0 0 1-.1-.99h.1l1-.01a2.5 2.5 0 0 0 .16-5H9.5a.5.5 0 0 1-.09-1zh1zm-4 0h1a.5.5 0 0 1 .09 1H5.5a2.5 2.5 0 0 0-.16 5H6.5a.5.5 0 0 1 .09 1H5.5a3.5 3.5 0 0 1-.2-7zh1zm0 3h5a.5.5 0 0 1 .09 1H5.5a.5.5 0 0 1-.09-1z" />
  </svg>
);

/** Fluent `open_16_regular`. */
export const OpenIcon = () => (
  <svg {...base}>
    <path d="M4.5 3C3.67 3 3 3.67 3 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V9.27a.5.5 0 0 1 1 0v2.23a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2h2.23a.5.5 0 0 1 0 1zm4.27-.5c0-.28.22-.5.5-.5h4.23c.28 0 .5.22.5.5v4.23a.5.5 0 0 1-1 0V3.71L9.62 7.08a.5.5 0 1 1-.7-.7L12.29 3H9.27a.5.5 0 0 1-.5-.5" />
  </svg>
);

/** Fluent `person_16_regular`. */
export const PersonSmallIcon = () => (
  <svg {...base}>
    <path d="M11.5 8c.83 0 1.5.67 1.5 1.5v.5c0 1.97-1.86 4-5 4s-5-2.03-5-4v-.5C3 8.67 3.67 8 4.5 8zm0 1h-7a.5.5 0 0 0-.5.5v.5c0 1.44 1.43 3 4 3s4-1.56 4-3v-.5a.5.5 0 0 0-.5-.5M8 1.5A2.75 2.75 0 1 1 8 7a2.75 2.75 0 0 1 0-5.5m0 1A1.75 1.75 0 1 0 8 6a1.75 1.75 0 0 0 0-3.5" />
  </svg>
);

/** Fluent `person_20_regular`. */
export const PersonIcon = () => (
  <svg {...base20}>
    <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0m-2 5a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.8A9 9 0 0 0 10 18c1.85 0 3.58-.39 4.87-1.2A4.4 4.4 0 0 0 17 13a2 2 0 0 0-2-2zm-1 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1c0 1.3-.62 2.28-1.67 2.95A8 8 0 0 1 10 17a8 8 0 0 1-4.33-1.05A3.4 3.4 0 0 1 4 13" />
  </svg>
);

/** Fluent `align_top_16_regular`. */
export const AlignTopIcon = () => (
  <svg {...base}>
    <path d="M1.5 2a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1zM2 5.75C2 4.78 2.78 4 3.75 4h1.5C6.22 4 7 4.78 7 5.75v6.5C7 13.22 6.22 14 5.25 14h-1.5C2.78 14 2 13.22 2 12.25zM3.75 5a.75.75 0 0 0-.75.75v6.5c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-6.5A.75.75 0 0 0 5.25 5zM9 5.75C9 4.78 9.78 4 10.75 4h1.5c.97 0 1.75.78 1.75 1.75v4.5c0 .97-.78 1.75-1.75 1.75h-1.5C9.78 12 9 11.22 9 10.25zM10.75 5a.75.75 0 0 0-.75.75v4.5c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-4.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Fluent `align_center_vertical_16_regular`. */
export const AlignMiddleIcon = () => (
  <svg {...base}>
    <path d="M8.5 15a.5.5 0 0 1-.5-.5V14H6.75C5.78 14 5 13.22 5 12.25v-1.5C5 9.78 5.78 9 6.75 9H8V7H5.75C4.78 7 4 6.22 4 5.25v-1.5C4 2.78 4.78 2 5.75 2H8v-.5a.5.5 0 0 1 1 0V2h2.25c.97 0 1.75.78 1.75 1.75v1.5C13 6.22 12.22 7 11.25 7H9v2h1.25c.97 0 1.75.78 1.75 1.75v1.5c0 .97-.78 1.75-1.75 1.75H9v.5a.5.5 0 0 1-.5.5M5.75 3a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h5.5c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75zm1 7a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h3.5c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75z" />
  </svg>
);

/** Fluent `align_bottom_16_regular`. */
export const AlignBottomIcon = () => (
  <svg {...base}>
    <path d="M1.5 14a.5.5 0 0 1 0-1h13a.5.5 0 0 1 0 1zm.5-3.75c0 .97.78 1.75 1.75 1.75h1.5C6.22 12 7 11.22 7 10.25v-6.5C7 2.78 6.22 2 5.25 2h-1.5C2.78 2 2 2.78 2 3.75zm1.75.75a.75.75 0 0 1-.75-.75v-6.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75zM9 10.25c0 .97.78 1.75 1.75 1.75h1.5c.97 0 1.75-.78 1.75-1.75v-4.5C14 4.78 13.22 4 12.25 4h-1.5C9.78 4 9 4.78 9 5.75zm1.75.75a.75.75 0 0 1-.75-.75v-4.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v4.5c0 .41-.34.75-.75.75z" />
  </svg>
);

/** Fluent `more_horizontal_16_regular`. */
export const MoreIcon = () => (
  <svg {...base}>
    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
  </svg>
);

/** Fluent `settings_16_regular`. */
export const SettingsIcon = () => (
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

/** Fluent `align_left_16_regular`. */
export const AlignLeftIcon = () => (
  <svg {...base}>
    <path d="M2 1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-1 0zm3.75.5C4.78 2 4 2.78 4 3.75v1.5C4 6.22 4.78 7 5.75 7h6.5C13.22 7 14 6.22 14 5.25v-1.5C14 2.78 13.22 2 12.25 2zM5 3.75c0-.41.34-.75.75-.75h6.5c.41 0 .75.34.75.75v1.5c0 .41-.34.75-.75.75h-6.5A.75.75 0 0 1 5 5.25zM5.75 9C4.78 9 4 9.78 4 10.75v1.5c0 .97.78 1.75 1.75 1.75h4.5c.97 0 1.75-.78 1.75-1.75v-1.5C12 9.78 11.22 9 10.25 9zM5 10.75c0-.41.34-.75.75-.75h4.5c.41 0 .75.34.75.75v1.5c0 .41-.34.75-.75.75h-4.5a.75.75 0 0 1-.75-.75z" />
  </svg>
);

/** Fluent `align_center_horizontal_16_regular`. */
export const AlignCenterHorizontalIcon = () => (
  <svg {...base}>
    <path d="M15 7.5a.5.5 0 0 1-.5.5H14v1.25c0 .97-.78 1.75-1.75 1.75h-1.5C9.78 11 9 10.22 9 9.25V8H7v2.25C7 11.22 6.22 12 5.25 12h-1.5C2.78 12 2 11.22 2 10.25V8h-.5a.5.5 0 0 1 0-1H2V4.75C2 3.78 2.78 3 3.75 3h1.5C6.22 3 7 3.78 7 4.75V7h2V5.75C9 4.78 9.78 4 10.75 4h1.5c.97 0 1.75.78 1.75 1.75V7h.5c.28 0 .5.22.5.5M3 10.25c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-5.5A.75.75 0 0 0 5.25 4h-1.5a.75.75 0 0 0-.75.75zm7-1c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75v-3.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75z" />
  </svg>
);

/** Fluent `align_right_16_regular`. */
export const AlignRightIcon = () => (
  <svg {...base}>
    <path d="M14 1.5a.5.5 0 0 0-1 0v13a.5.5 0 0 0 1 0zm-3.75.5c.97 0 1.75.78 1.75 1.75v1.5C12 6.22 11.22 7 10.25 7h-6.5C2.78 7 2 6.22 2 5.25v-1.5C2 2.78 2.78 2 3.75 2zM11 3.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h6.5c.41 0 .75-.34.75-.75zM10.25 9c.97 0 1.75.78 1.75 1.75v1.5c0 .97-.78 1.75-1.75 1.75h-4.5C4.78 14 4 13.22 4 12.25v-1.5C4 9.78 4.78 9 5.75 9zm.75 1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h4.5c.41 0 .75-.34.75-.75z" />
  </svg>
);

/** Fluent `subtract_16_regular`. */
export const SubtractIcon = () => (
  <svg {...base}>
    <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8" />
  </svg>
);

/** Fluent `thumb_like_16_regular`. */
export const ThumbLikeIcon = () => (
  <svg {...base}>
    <path d="M8.03 1.92c.21-.52.8-1.08 1.55-.87.6.17.97.52 1.2 1 .2.44.25.96.26 1.46a8 8 0 0 1-.24 1.74q-.09.4-.19.74h1.38a2 2 0 0 1 1.92 2.56l-1.36 4.65a2.5 2.5 0 0 1-3.15 1.68L4.05 13.2A2 2 0 0 1 2.77 12l-.52-1.4a2 2 0 0 1 .86-2.42l1.87-1.1.02-.01.1-.09q.15-.1.4-.4c.35-.39.82-1.03 1.3-2.04.2-.44.37-.78.53-1.1.25-.5.46-.92.7-1.52m-2.51 6-.02.01-1.88 1.11a1 1 0 0 0-.43 1.22l.52 1.38a1 1 0 0 0 .64.6l5.35 1.68c.8.26 1.65-.2 1.89-1l1.36-4.65A1 1 0 0 0 12 6.99H9.93a.5.5 0 0 1-.48-.67c.1-.28.26-.77.38-1.3.13-.54.22-1.08.2-1.5q0-.68-.16-1.05a.8.8 0 0 0-.56-.45q-.06-.03-.16.03a.5.5 0 0 0-.19.25c-.25.63-.5 1.11-.76 1.65q-.24.45-.5 1.01a10 10 0 0 1-1.45 2.28 5 5 0 0 1-.7.66zm-.54-.84Z" />
  </svg>
);

/** Fluent `thumb_dislike_16_regular`. */
export const ThumbDislikeIcon = () => (
  <svg {...base}>
    <path d="m10.58 10 .05.45a11 11 0 0 1-.02 2.68c-.07.44-.2.88-.44 1.23-.25.38-.64.64-1.17.64s-.83-.37-1.02-.7c-.2-.31-.36-.75-.54-1.2l-.01-.03c-.55-1.4-1.3-3.31-3.3-4.65q-.47-.3-.86-.46c-.7-.3-1.32-1.06-1.16-1.94l.23-1.2a2 2 0 0 1 1.43-1.55l4.95-1.38a3.5 3.5 0 0 1 4.37 2.73l.46 2.42A2.5 2.5 0 0 1 11.09 10zm1.53-5.2a2.5 2.5 0 0 0-3.13-1.94L4.03 4.23a1 1 0 0 0-.71.78l-.22 1.2c-.06.28.16.66.55.82q.47.2 1.03.55c2.28 1.53 3.13 3.7 3.67 5.11l.01.02q.28.74.47 1.08A1 1 0 0 0 9 14q.2.01.35-.2.19-.27.28-.83a10 10 0 0 0-.08-3.12l-.03-.2-.01-.05V9.6A.5.5 0 0 1 10 9h1.09a1.5 1.5 0 0 0 1.47-1.78z" />
  </svg>
);

/** Fluent `speaker_2_16_regular`. */
export const SpeakerIcon = () => (
  <svg {...base}>
    <path d="M8.7 2.04q.29.14.3.46v11a.5.5 0 0 1-.85.36l-2.93-2.88H3.5A1.5 1.5 0 0 1 2 9.48V6.5C2 5.66 2.67 5 3.5 5h1.72l2.93-2.85a.5.5 0 0 1 .54-.1M8 3.69 5.78 5.85a.5.5 0 0 1-.35.14H3.5a.5.5 0 0 0-.5.5v3c0 .27.22.5.5.5h1.93a.5.5 0 0 1 .35.13L8 12.32zm2.11 1.5a.5.5 0 0 1 .7-.08h.01l.02.02.19.18c.1.12.26.3.4.54.3.48.57 1.2.57 2.15a4 4 0 0 1-.97 2.69l-.2.2h-.01s-.45.24-.7-.08a.5.5 0 0 1 .07-.7l.02-.01.08-.09q.12-.12.29-.38c.2-.35.42-.88.42-1.63a3 3 0 0 0-.7-2l-.11-.11a.5.5 0 0 1-.08-.7m1.7-2.08a.5.5 0 1 0-.62.78l.01.01.25.24A5.5 5.5 0 0 1 13 8a5.5 5.5 0 0 1-1.8 4.1h-.01a.5.5 0 0 0 .62.8l.04-.04.32-.3A6.5 6.5 0 0 0 14 8a6.5 6.5 0 0 0-2.15-4.86l-.03-.02zM10.2 5.89Z" />
  </svg>
);

/** Fluent `arrow_clockwise_16_regular`. */
export const RegenerateIcon = () => (
  <svg {...base}>
    <path d="M3 8a5 5 0 0 1 9-3h-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.53A5.99 5.99 0 0 0 2 8a6 6 0 0 0 11.98.54.5.5 0 0 0-1-.08A5 5 0 0 1 3 8" />
  </svg>
);

/** Fluent `edit_16_regular`. */
export const EditIcon = () => (
  <svg {...base}>
    <path d="M14.24 1.76a2.6 2.6 0 0 0-3.71 0L2.66 9.64q-.57.57-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86q.78-.21 1.35-.78l7.88-7.87a2.6 2.6 0 0 0 0-3.7m-3 .71a1.62 1.62 0 1 1 2.29 2.3l-.78.77-2.3-2.29zM9.75 3.96l2.3 2.29-6.4 6.39q-.37.37-.89.5l-2.57.67.66-2.57q.14-.52.51-.9z" />
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

/*
 * Area's marks. They are stroked rather than filled, so they take their own base: the
 * fill is off and the colour rides on the stroke. Fitted to Fluent's optical weight by
 * measurement -- see the note in gen-icons.mjs.
 */
const areaBase = { ...base, fill: "none" };

/** Area `angle`. */
export const AngleIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 2.5V13.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 8C5.5 8 8 10.5 8 13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `aspect-ratio`. */
export const AspectRatioIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M5.5 8V5.5H8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 8V10.5H8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `auto-layout`. */
export const AutoLayoutIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="4.5" height="11" rx="1.125" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="9.5" y="3" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M9.5 11 11 12.5 13.5 9.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `auto-position`. */
export const AutoPositionIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 2.5H10.4C13.4 2.5 13.4 7 10.4 7H5.6C2.6 7 2.6 11.5 5.6 11.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 9.5 13.5 11.5 11.5 13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `bars-three`. */
export const BarsThreeIcon = () => (
  <svg {...areaBase}>
    <rect x="2" y="4" width="2" height="8" rx="1" fill="currentColor"/>
    <rect x="7" y="2" width="2" height="12" rx="1" fill="currentColor"/>
    <rect x="12" y="4" width="2" height="8" rx="1" fill="currentColor"/>
  </svg>
);

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

/** Area `corner-radius`. */
export const CornerRadiusIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 13.5V6.5C2.5 4.29 4.29 2.5 6.5 2.5H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

/** Area `corners`. */
export const CornersIcon = () => (
  <svg {...areaBase}>
    <path d="M6 2.5H5C3.62 2.5 2.5 3.62 2.5 5V6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 2.5H11C12.38 2.5 13.5 3.62 13.5 5V6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 10V11C13.5 12.38 12.38 13.5 11 13.5H10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 13.5H5C3.62 13.5 2.5 12.38 2.5 11V10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `dots-four`. */
export const DotsFourIcon = () => (
  <svg {...areaBase}>
    <circle cx="4.25" cy="4.25" r="2.25" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="11.75" cy="4.25" r="2.25" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="4.25" cy="11.75" r="2.25" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="11.75" cy="11.75" r="2.25" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

/** Area `eye-slash`. */
export const EyeSlashIcon = () => (
  <svg {...areaBase}>
    <path d="M2 8C4 4.44 5.9 3 8 3C10.1 3 12 4.44 14 8C12 11.56 10.1 13 8 13C5.9 13 4 11.56 2 8Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M3.3 12.7 12.7 3.3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `eye`. */
export const EyeIcon = () => (
  <svg {...areaBase}>
    <path d="M2 8C4 4.44 5.9 3 8 3C10.1 3 12 4.44 14 8C12 11.56 10.1 13 8 13C5.9 13 4 11.56 2 8Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

/** Area `flip-horizontal`. */
export const FlipHorizontalIcon = () => (
  <svg {...areaBase}>
    <path d="M8 2.5V13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.723 4.876L6.087 7.535Q6.5 8 6.087 8.465L3.723 11.124Q2.5 12.5 2.5 10.659L2.5 5.341Q2.5 3.5 3.723 4.876Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.277 4.876L9.913 7.535Q9.5 8 9.913 8.465L12.277 11.124Q13.5 12.5 13.5 10.659L13.5 5.341Q13.5 3.5 12.277 4.876Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `flip-vertical`. */
export const FlipVerticalIcon = () => (
  <svg {...areaBase}>
    <path d="M2.5 8H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.876 3.723L7.535 6.087Q8 6.5 8.465 6.087L11.124 3.723Q12.5 2.5 10.659 2.5L5.341 2.5Q3.5 2.5 4.876 3.723Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.876 12.277L7.535 9.913Q8 9.5 8.465 9.913L11.124 12.277Q12.5 13.5 10.659 13.5L5.341 13.5Q3.5 13.5 4.876 12.277Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `flow-free`. */
export const FlowFreeIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="4.25" height="4.25" rx="1.0625" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="9.25" y="5.25" width="4.25" height="4.25" rx="1.0625" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="3.5" y="9.25" width="4.25" height="4.25" rx="1.0625" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

/** Area `flow-horizontal`. */
export const FlowHorizontalIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M2.5 11.25H13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.25 9 13.5 11.25 11.25 13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `flow-vertical`. */
export const FlowVerticalIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M11.25 2.5V13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11.25 11.25 13.5 13.5 11.25" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `flow-wrap`. */
export const FlowWrapIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

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

/** Area `opacity`. */
export const OpacityIcon = () => (
  <svg {...areaBase}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="10.5" cy="5.5" r="0.55" fill="currentColor"/>
    <circle cx="8" cy="8" r="0.55" fill="currentColor"/>
    <circle cx="10.5" cy="8" r="0.55" fill="currentColor"/>
    <circle cx="5.5" cy="10.5" r="0.55" fill="currentColor"/>
    <circle cx="8" cy="10.5" r="0.55" fill="currentColor"/>
    <circle cx="10.5" cy="10.5" r="0.55" fill="currentColor"/>
  </svg>
);

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

/** Area `rotate`. */
export const RotateIcon = () => (
  <svg {...areaBase}>
    <path d="M8.75 7.48L10.96 9.69Q11.71 10.44 10.96 11.19L8.75 13.4Q8 14.15 7.25 13.4L5.04 11.19Q4.29 10.44 5.04 9.69L7.25 7.48Q8 6.73 8.75 7.48Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.18 6.84C2.83 4.59 4.8 2.95 7.13 2.73C9.47 2.5 11.71 3.73 12.78 5.83" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.43 5.48 12.78 5.83 13.13 2.48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Area `sliders`. */
export const SlidersIcon = () => (
  <svg {...areaBase}>
    <path d="M4.5 2.5V7.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 11.5V13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4.5" cy="9.5" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M11.5 2.5V4.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 8.5V13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11.5" cy="6.5" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

/** Area `token`. */
export const TokenIcon = () => (
  <svg {...areaBase}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
