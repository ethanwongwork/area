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
