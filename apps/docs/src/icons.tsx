/**
 * Fluent System Icons, 16px Regular.
 *
 * Microsoft's set, taken verbatim from `@fluentui/svg-icons` -- the path data below is
 * generated from that package, never drawn by hand. Fluent's 16px grid is the same inline
 * size Area's density axis uses, so an icon here needs no rescaling to sit on a control.
 *
 * Two things follow from using the real set rather than approximating it. Fluent icons are
 * *filled* paths, not strokes, so they take `fill` and never `stroke` or `stroke-width`;
 * and they are optically corrected per size, which is why the 16px cut is used at 16px
 * instead of scaling the 20 or 24.
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

/** Fluent `add_16_regular`. */
export const PlusIcon = () => (
  <svg {...base}>
    <path d="M8 2c.28 0 .5.22.5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5c0-.28.22-.5.5-.5" />
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

/** Fluent `chevron_down_16_regular`. */
export const ChevronIcon = () => (
  <svg {...base}>
    <path d="M3.15 5.65c.2-.2.5-.2.7 0L8 9.79l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7" />
  </svg>
);

/** Fluent `dismiss_16_regular`. */
export const DismissIcon = () => (
  <svg {...base}>
    <path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" />
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
