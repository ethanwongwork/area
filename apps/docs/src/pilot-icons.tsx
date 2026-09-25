/**
 * Area icon pilot, generated from apps/docs/assets/area-icons-pilot by
 * scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each icon is a stroked 16px drawing. The line weight follows --area-weight-icon (1.125px for
 * Geist); pass `weight` in CSS pixels to override it, as the gallery comparison does.
 * Filled variants are derived from each shape's data-filled role; cut-outs use a mask.
 */
import { useId, type SVGProps } from "react";

/** weight: line in CSS px at 16px (overrides --area-weight-icon). size: rendered size in px;
 *  the line then follows the size curve instead of scaling with the drawing. */
export type PilotIconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { weight?: number; size?: number };
/** Size curve (docs/specs/icons.md, "Sizes"): the line grows with size^0.45, Cursor's
 *  16 → 24px step (1.25 → 1.5px). In drawing units that is a factor of (size / 16)^-0.55. */
export const sizeFactor = (size?: number) => size ? Math.pow(size / 16, -0.55) : 1;
export const sw = (weight: number | undefined, size: number | undefined, ratio = 1) => {
  const k = ratio * sizeFactor(size);
  if (weight !== undefined) return weight * k;
  return k === 1 ? "var(--area-weight-icon)" : `calc(var(--area-weight-icon) * ${k.toFixed(4)})`;
};
const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;
const useMaskId = () => "area-icon-" + useId().replace(/[^A-Za-z0-9-]/g, "");

export const PilotAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5V13.5M2.5 8H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 2.688 V 13.313 M 2.688 8 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAlignBottomIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(270 8 8)">
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotAlignBottomFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(270 8 8)">
        <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAlignCenterIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5V3.5M8 6.5V9.5M8 12.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignCenterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="4" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 2.688 V 3.5 M 8 6.5 V 9.5 M 8 12.5 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAlignLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAlignMiddleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M8 2.5V3.5M8 6.5V9.5M8 12.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotAlignMiddleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="4" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 8 2.688 V 3.5 M 8 6.5 V 9.5 M 8 12.5 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAlignRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotAlignRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAlignTopIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotAlignTopFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowDownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(180 8 8)">
      <path d="M8 14V2M3 7L8 2L13 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowDownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(180 8 8)">
        <path d="M 8 13.813 V 2 M 3.133 6.867 L 8 2 L 12.867 6.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(270 8 8)">
      <path d="M8 14V2M3 7L8 2L13 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(270 8 8)">
        <path d="M 8 13.813 V 2 M 3.133 6.867 L 8 2 L 12.867 6.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(90 8 8)">
      <path d="M8 14V2M3 7L8 2L13 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(90 8 8)">
        <path d="M 8 13.813 V 2 M 3.133 6.867 L 8 2 L 12.867 6.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowUpIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 14V2M3 7L8 2L13 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotArrowUpFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 13.813 V 2 M 3.133 6.867 L 8 2 L 12.867 6.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBellIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8C12.5 9.5 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBellFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4 12.625H12" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8C12.5 9.5 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBookIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 4.5C6.5 3.5 4.5 3.5 1.5 3.5V12C4.5 12 6.5 12 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5C9.5 3.5 11.5 3.5 14.5 3.5V12C11.5 12 9.5 12 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBookFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 2.5L8 4.5V13L8 15" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8 4.5C6.5 3.5 4.5 3.5 1.5 3.5V12C4.5 12 6.5 12 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 4.5C9.5 3.5 11.5 3.5 14.5 3.5V12C11.5 12 9.5 12 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCheckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 8L6.5 11.5L13.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCheckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.133 8.133 L 6.5 11.5 L 13.367 4.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotChevronDownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChevronDownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.633 5.633 L 8 10 L 12.367 5.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotChevronLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(90 8 8)">
      <path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotChevronLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(90 8 8)">
        <path d="M 3.633 5.633 L 8 10 L 12.367 5.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotChevronRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(270 8 8)">
      <path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotChevronRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(270 8 8)">
        <path d="M 3.633 5.633 L 8 10 L 12.367 5.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotChevronUpIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(180 8 8)">
      <path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotChevronUpFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(180 8 8)">
        <path d="M 3.633 5.633 L 8 10 L 12.367 5.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotColorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2L11.6 6.8A4.5 4.5 0 1 1 4.4 6.8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotColorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 2L11.6 6.8A4.5 4.5 0 1 1 4.4 6.8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCopyIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.5V3.5A1 1 0 0 1 3.5 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCopyFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 8.313 V 3.5 A 1 1 0 0 1 3.5 2.5 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDismissIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 3L13 13M13 3L3 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDismissFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.133 3.133 L 12.867 12.867 M 12.867 3.133 L 3.133 12.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDocumentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 1.5H8.5L12.5 5.5V13.5A1 1 0 0 1 11.5 14.5H4.5A1 1 0 0 1 3.5 13.5V2.5A1 1 0 0 1 4.5 1.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 1.5V4.5A1 1 0 0 0 9.5 5.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 8.5H9.5M6.5 11.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8.5 -0.5L8.5 1.5V4.5A1 1 0 0 0 9.5 5.5H12.5L14.5 5.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M6.5 8.5H9.5M6.5 11.5H9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 1.5H8.5L12.5 5.5V13.5A1 1 0 0 1 11.5 14.5H4.5A1 1 0 0 1 3.5 13.5V2.5A1 1 0 0 1 4.5 1.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotExpandIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.5 2.5H13.5V5.5M13.5 2.5L9.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 13.5H2.5V10.5M2.5 13.5L6.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotExpandFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 10.688 2.5 H 13.5 V 5.313 M 13.5 2.5 L 9.633 6.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.313 13.5 H 2.5 V 10.688 M 2.5 13.5 L 6.367 9.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotEyeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFlashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M9.5 1.5L4 9H8.5L6.5 14.5L12 7H7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlashFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M9.5 1.5L4 9H8.5L6.5 14.5L12 7H7.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFolderIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 11.5V4.5A1 1 0 0 1 3.5 3.5H6.5L8 5H12.5A1 1 0 0 1 13.5 6V11.5A1 1 0 0 1 12.5 12.5H3.5A1 1 0 0 1 2.5 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6.5H6.5L8 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 6.5L2.5 6.5H6.5L8 5L9.414 3.586" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.5 11.5V4.5A1 1 0 0 1 3.5 3.5H6.5L8 5H12.5A1 1 0 0 1 13.5 6V11.5A1 1 0 0 1 12.5 12.5H3.5A1 1 0 0 1 2.5 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotInfoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.25V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="4.375" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotInfoFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 7.25V11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="4.375" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotLayersIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 3.25L14 6.25L8 9.25L2 6.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9.604L8 12.604L14 9.604" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLayersFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 3.25L14 6.25L8 9.25L2 6.25Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.168 9.688 L 8 12.604 L 13.832 9.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLinkIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 5H5A3 3 0 0 0 5 11H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 5H11A3 3 0 0 1 11 11H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLinkFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 6.313 5 H 5 A 3 3 0 0 0 5 11 H 6.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.688 5 H 11 A 3 3 0 0 1 11 11 H 9.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.188 8 H 9.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotListIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 3.5H13.5M2.5 6.5H13.5M2.5 9.5H13.5M2.5 12.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 3.5 H 13.313 M 2.688 6.5 H 13.313 M 2.688 9.5 H 13.313 M 2.688 12.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMoreHorizontalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const PilotMoreHorizontalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="3" cy="8" r="1.1875" fill="currentColor" />
      <circle cx="8" cy="8" r="1.1875" fill="currentColor" />
      <circle cx="13" cy="8" r="1.1875" fill="currentColor" />
    </svg>
  );
};

export const PilotOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5H3.5A1 1 0 0 0 2.5 3.5V12.5A1 1 0 0 0 3.5 13.5H12.5A1 1 0 0 0 13.5 12.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 2.5H13.5V5.5M13.5 2.5L8 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 7.813 2.5 H 3.5 A 1 1 0 0 0 2.5 3.5 V 12.5 A 1 1 0 0 0 3.5 13.5 H 12.5 A 1 1 0 0 0 13.5 12.5 V 8.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.688 2.5 H 13.5 V 5.313 M 13.5 2.5 L 8.133 7.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotOptionsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 4H3.5M6.5 4H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="4" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8H9.5M12.5 8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12H5.5M8.5 12H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="12" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOptionsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5" cy="4" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="8" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 4 H 3.5 M 6.5 4 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 8 H 9.5 M 12.5 8 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 12 H 5.5 M 8.5 12 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2.5" y="2.5" width="11" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPersonIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="5" r="2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 13.5V13A3 3 0 0 1 6.5 10H9.5A3 3 0 0 1 12.5 13V13.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="5" r="2.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 13.5V13A3 3 0 0 1 6.5 10H9.5A3 3 0 0 1 12.5 13V13.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotResetIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 5.5A5.59 5.59 0 1 1 2.6 9.447" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 2.5V5.5H6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotResetFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3 5.5 A 5.59 5.59 0 1 1 2.6 9.447" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3 2.688 V 5.5 H 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSearchIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSearchFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.5 10.5 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSettingsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.75 4.103L7 2.5L9 2.5L9.25 4.103L10.75 4.969L12.263 4.384L13.263 6.116L12 7.134L12 8.866L13.263 9.884L12.263 11.616L10.75 11.031L9.25 11.897L9 13.5L7 13.5L6.75 11.897L5.25 11.031L3.737 11.616L2.737 9.884L4 8.866L4 7.134L2.737 6.116L3.737 4.384L5.25 4.969Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSettingsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.75 4.103L7 2.5L9 2.5L9.25 4.103L10.75 4.969L12.263 4.384L13.263 6.116L12 7.134L12 8.866L13.263 9.884L12.263 11.616L10.75 11.031L9.25 11.897L9 13.5L7 13.5L6.75 11.897L5.25 11.031L3.737 11.616L2.737 9.884L4 8.866L4 7.134L2.737 6.116L3.737 4.384L5.25 4.969Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotShapesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="6.5" y="6.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.872 4A3.5 3.5 0 1 0 4 8.872" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShapesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="6.5" y="6.5" width="7" height="7" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.872 4 A 3.5 3.5 0 1 0 4 8.872" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSquareDashedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4V3.5A1 1 0 0 1 3.5 2.5H4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2.5H12.5A1 1 0 0 1 13.5 3.5V4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 12V12.5A1 1 0 0 1 12.5 13.5H12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 13.5H3.5A1 1 0 0 1 2.5 12.5V12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2.5H9.5M13.5 6.5V9.5M9.5 13.5H6.5M2.5 9.5V6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSquareDashedFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 3.813 V 3.5 A 1 1 0 0 1 3.5 2.5 H 3.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.188 2.5 H 12.5 A 1 1 0 0 1 13.5 3.5 V 3.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13.5 12.188 V 12.5 A 1 1 0 0 1 12.5 13.5 H 12.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.813 13.5 H 3.5 A 1 1 0 0 1 2.5 12.5 V 12.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.688 2.5 H 9.313 M 13.5 6.688 V 9.313 M 9.313 13.5 H 6.688 M 2.5 9.313 V 6.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStatusAvailableIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8L7 10L11 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStatusAvailableFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 8L7 10L11 6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTextIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 13.5L8 2.5L13 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.818 9.5H11.182" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.078 13.329 L 8 2.5 L 12.922 13.329" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.818 9.5 H 11.182" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTrashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 4.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 4.5V2.5A1 1 0 0 1 7.5 1.5H8.5A1 1 0 0 1 9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.5V13.5A1 1 0 0 0 4.5 14.5H11.5A1 1 0 0 0 12.5 13.5V4.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 7.5V11.5M9.5 7.5V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTrashFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 7.5V11.5M9.5 7.5V11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 4.5V13.5A1 1 0 0 0 4.5 14.5H11.5A1 1 0 0 0 12.5 13.5V4.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 3.188 4.5 H 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.5 4.5 V 2.5 A 1 1 0 0 1 7.5 1.5 H 8.5 A 1 1 0 0 1 9.5 2.5 V 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotWarningIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.891 3.133A1.25 1.25 0 0 1 9.109 3.133L13.55 11.673A1.25 1.25 0 0 1 12.441 13.5L3.559 13.5A1.25 1.25 0 0 1 2.45 11.673Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6.25V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10.75" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotWarningFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 6.25V8" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="10.75" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.891 3.133A1.25 1.25 0 0 1 9.109 3.133L13.55 11.673A1.25 1.25 0 0 1 12.441 13.5L3.559 13.5A1.25 1.25 0 0 1 2.45 11.673Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = [{"id":"batch-1","title":"Batch 1 · Core","icons":{"add":"approved","arrow-up":"approved","bell":"review","check":"approved","chevron-down":"approved","copy":"approved","dismiss":"approved","document":"approved","eye":"approved","folder":"approved","info":"approved","link":"approved","more-horizontal":"approved","open":"review","person":"approved","reset":"review","search":"approved","settings":"approved","status-available":"approved","trash":"approved","warning":"approved"}},{"id":"batch-2","title":"Batch 2 · Alignment","icons":{"align-left":"review","align-center":"review"}},{"id":"batch-3","title":"Batch 3 · Docs chrome","icons":{"expand":"review","panel-left":"review","book":"review","options":"review","color":"review","text":"review","shapes":"review","list":"review","square-dashed":"review","layers":"review","flash":"review"}}] as const;

export const PILOT_ICONS = [
  { name: "add", keyline: "square", derivedFrom: undefined, Icon: PilotAddIcon, Filled: PilotAddFilledIcon, fill: "weight" },
  { name: "align-bottom", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignBottomIcon, Filled: PilotAlignBottomFilledIcon, fill: "solid" },
  { name: "align-center", keyline: "square", derivedFrom: undefined, Icon: PilotAlignCenterIcon, Filled: PilotAlignCenterFilledIcon, fill: "solid" },
  { name: "align-left", keyline: "square", derivedFrom: undefined, Icon: PilotAlignLeftIcon, Filled: PilotAlignLeftFilledIcon, fill: "solid" },
  { name: "align-middle", keyline: "square", derivedFrom: "align-center", Icon: PilotAlignMiddleIcon, Filled: PilotAlignMiddleFilledIcon, fill: "solid" },
  { name: "align-right", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignRightIcon, Filled: PilotAlignRightFilledIcon, fill: "solid" },
  { name: "align-top", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignTopIcon, Filled: PilotAlignTopFilledIcon, fill: "solid" },
  { name: "arrow-down", keyline: "vertical", derivedFrom: "arrow-up", Icon: PilotArrowDownIcon, Filled: PilotArrowDownFilledIcon, fill: "weight" },
  { name: "arrow-left", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowLeftIcon, Filled: PilotArrowLeftFilledIcon, fill: "weight" },
  { name: "arrow-right", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowRightIcon, Filled: PilotArrowRightFilledIcon, fill: "weight" },
  { name: "arrow-up", keyline: "vertical", derivedFrom: undefined, Icon: PilotArrowUpIcon, Filled: PilotArrowUpFilledIcon, fill: "weight" },
  { name: "bell", keyline: "square", derivedFrom: undefined, Icon: PilotBellIcon, Filled: PilotBellFilledIcon, fill: "solid" },
  { name: "book", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBookIcon, Filled: PilotBookFilledIcon, fill: "solid" },
  { name: "check", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCheckIcon, Filled: PilotCheckFilledIcon, fill: "weight" },
  { name: "chevron-down", keyline: "horizontal", derivedFrom: undefined, Icon: PilotChevronDownIcon, Filled: PilotChevronDownFilledIcon, fill: "weight" },
  { name: "chevron-left", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronLeftIcon, Filled: PilotChevronLeftFilledIcon, fill: "weight" },
  { name: "chevron-right", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronRightIcon, Filled: PilotChevronRightFilledIcon, fill: "weight" },
  { name: "chevron-up", keyline: "horizontal", derivedFrom: "chevron-down", Icon: PilotChevronUpIcon, Filled: PilotChevronUpFilledIcon, fill: "weight" },
  { name: "color", keyline: "vertical", derivedFrom: undefined, Icon: PilotColorIcon, Filled: PilotColorFilledIcon, fill: "solid" },
  { name: "copy", keyline: "square", derivedFrom: undefined, Icon: PilotCopyIcon, Filled: PilotCopyFilledIcon, fill: "solid" },
  { name: "dismiss", keyline: "circle", derivedFrom: undefined, Icon: PilotDismissIcon, Filled: PilotDismissFilledIcon, fill: "weight" },
  { name: "document", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentIcon, Filled: PilotDocumentFilledIcon, fill: "solid" },
  { name: "expand", keyline: "square", derivedFrom: undefined, Icon: PilotExpandIcon, Filled: PilotExpandFilledIcon, fill: "weight" },
  { name: "eye", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeIcon, Filled: PilotEyeFilledIcon, fill: "solid" },
  { name: "flash", keyline: "vertical", derivedFrom: undefined, Icon: PilotFlashIcon, Filled: PilotFlashFilledIcon, fill: "solid" },
  { name: "folder", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderIcon, Filled: PilotFolderFilledIcon, fill: "solid" },
  { name: "info", keyline: "circle", derivedFrom: undefined, Icon: PilotInfoIcon, Filled: PilotInfoFilledIcon, fill: "solid" },
  { name: "layers", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLayersIcon, Filled: PilotLayersFilledIcon, fill: "solid" },
  { name: "link", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLinkIcon, Filled: PilotLinkFilledIcon, fill: "weight" },
  { name: "list", keyline: "horizontal", derivedFrom: undefined, Icon: PilotListIcon, Filled: PilotListFilledIcon, fill: "weight" },
  { name: "more-horizontal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMoreHorizontalIcon, Filled: PilotMoreHorizontalFilledIcon, fill: "weight" },
  { name: "open", keyline: "square", derivedFrom: undefined, Icon: PilotOpenIcon, Filled: PilotOpenFilledIcon, fill: "weight" },
  { name: "options", keyline: "square", derivedFrom: undefined, Icon: PilotOptionsIcon, Filled: PilotOptionsFilledIcon, fill: "solid" },
  { name: "panel-left", keyline: "square", derivedFrom: undefined, Icon: PilotPanelLeftIcon, Filled: PilotPanelLeftFilledIcon, fill: "solid" },
  { name: "panel-right", keyline: "square", derivedFrom: "panel-left", Icon: PilotPanelRightIcon, Filled: PilotPanelRightFilledIcon, fill: "solid" },
  { name: "person", keyline: "vertical", derivedFrom: undefined, Icon: PilotPersonIcon, Filled: PilotPersonFilledIcon, fill: "solid" },
  { name: "reset", keyline: "circle", derivedFrom: undefined, Icon: PilotResetIcon, Filled: PilotResetFilledIcon, fill: "weight" },
  { name: "search", keyline: "circle", derivedFrom: undefined, Icon: PilotSearchIcon, Filled: PilotSearchFilledIcon, fill: "weight" },
  { name: "settings", keyline: "circle", derivedFrom: undefined, Icon: PilotSettingsIcon, Filled: PilotSettingsFilledIcon, fill: "solid" },
  { name: "shapes", keyline: "square", derivedFrom: undefined, Icon: PilotShapesIcon, Filled: PilotShapesFilledIcon, fill: "solid" },
  { name: "square-dashed", keyline: "square", derivedFrom: undefined, Icon: PilotSquareDashedIcon, Filled: PilotSquareDashedFilledIcon, fill: "weight" },
  { name: "status-available", keyline: "circle", derivedFrom: undefined, Icon: PilotStatusAvailableIcon, Filled: PilotStatusAvailableFilledIcon, fill: "solid" },
  { name: "text", keyline: "square", derivedFrom: undefined, Icon: PilotTextIcon, Filled: PilotTextFilledIcon, fill: "weight" },
  { name: "trash", keyline: "vertical", derivedFrom: undefined, Icon: PilotTrashIcon, Filled: PilotTrashFilledIcon, fill: "solid" },
  { name: "warning", keyline: "circle", derivedFrom: undefined, Icon: PilotWarningIcon, Filled: PilotWarningFilledIcon, fill: "solid" },
] as const;
