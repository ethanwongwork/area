/**
 * A handful of icons for the demos.
 *
 * Inline SVG at 16x16 with a 1.5px stroke, which is the inline icon size and weight every
 * system surveyed converges on. They size from the CSS, never from font-size.
 */
const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PlusIcon = () => (
  <svg {...base}>
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="7.2" cy="7.2" r="3.8" />
    <path d="M10.2 10.2L13 13" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base}>
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

export const InfoIcon = () => (
  <svg {...base}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 7.2v4M8 5.1v.2" />
  </svg>
);

export const AlertIcon = () => (
  <svg {...base}>
    <path d="M8 2.8L14 13H2z" />
    <path d="M8 6.6v3M8 11.3v.2" />
  </svg>
);

export const ArrowIcon = () => (
  <svg {...base}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
