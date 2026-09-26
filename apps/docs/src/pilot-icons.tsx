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
    <rect x="2.5" y="3.5" width="11" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4.5" y="9.5" width="7" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignCenterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="3.5" width="11" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4.5" y="9.5" width="7" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <rect x="2.5" y="3.5" width="11" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4.5" y="9.5" width="7" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotAlignMiddleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="2.5" y="3.5" width="11" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="4.5" y="9.5" width="7" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotAngleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 7.5A6 6 0 0 1 8.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAngleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 2.688 V 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 7.5 A 6 6 0 0 1 8.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotAspectRatioIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 7.5V5.5H7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 8.5V10.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAspectRatioFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5.5 7.5V5.5H7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 8.5V10.5H8.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAutoLayoutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="4" height="11" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2.5" width="4" height="4" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11L10.5 12.5L13.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAutoLayoutFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="11" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2.5" width="4" height="4" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.133 11.133 L 10.5 12.5 L 13.367 9.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M8 4.5C7 3.2 5 2.6 3 3A1.5 1.5 0 0 0 1.5 4.5V10A1.5 1.5 0 0 0 3 11.5C5 11.1 7 11.7 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5C9 3.2 11 2.6 13 3A1.5 1.5 0 0 1 14.5 4.5V10A1.5 1.5 0 0 1 13 11.5C11 11.1 9 11.7 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M8 4.5C7 3.2 5 2.6 3 3A1.5 1.5 0 0 0 1.5 4.5V10A1.5 1.5 0 0 0 3 11.5C5 11.1 7 11.7 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 4.5C9 3.2 11 2.6 13 3A1.5 1.5 0 0 1 14.5 4.5V10A1.5 1.5 0 0 1 13 11.5C11 11.1 9 11.7 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCalendarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="4" width="11" height="9.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 7H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCalendarFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 7L2.5 7H13.5L15.5 7" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="4" width="11" height="9.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 5.5 2.688 V 4.313 M 10.5 2.688 V 4.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotClockIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5V8L10.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotClockFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 4.5V8L10.5 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotColorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.427 2.179A0.75 0.75 0 0 1 8.573 2.179L11.82 6.024A5 5 0 1 1 4.18 6.024Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotColorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.427 2.179A0.75 0.75 0 0 1 8.573 2.179L11.82 6.024A5 5 0 1 1 4.18 6.024Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCopyIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.5V4A1.5 1.5 0 0 1 4 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCopyFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 8.313 V 4 A 1.5 1.5 0 0 1 4 2.5 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCornerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 12.5V8.5A5 5 0 0 1 8.5 3.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCornerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.5 12.313 V 8.5 A 5 5 0 0 1 8.5 3.5 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCornerBottomLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(1 0 0 -1 0 16)">
      <path d="M3.5 12.5V8.5A5 5 0 0 1 8.5 3.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotCornerBottomLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(1 0 0 -1 0 16)">
        <path d="M 3.5 12.313 V 8.5 A 5 5 0 0 1 8.5 3.5 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCornerBottomRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(180 8 8)">
      <path d="M3.5 12.5V8.5A5 5 0 0 1 8.5 3.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotCornerBottomRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(180 8 8)">
        <path d="M 3.5 12.313 V 8.5 A 5 5 0 0 1 8.5 3.5 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCornerTopRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M3.5 12.5V8.5A5 5 0 0 1 8.5 3.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotCornerTopRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M 3.5 12.313 V 8.5 A 5 5 0 0 1 8.5 3.5 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCornersIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 2.5H5A2.5 2.5 0 0 0 2.5 5V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 2.5H11A2.5 2.5 0 0 1 13.5 5V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 10V11A2.5 2.5 0 0 1 11 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 13.5H5A2.5 2.5 0 0 1 2.5 11V10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCornersFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.813 2.5 H 5 A 2.5 2.5 0 0 0 2.5 5 V 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.188 2.5 H 11 A 2.5 2.5 0 0 1 13.5 5 V 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13.5 10.188 V 11 A 2.5 2.5 0 0 1 11 13.5 H 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.813 13.5 H 5 A 2.5 2.5 0 0 1 2.5 11 V 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 9H9.5M6.5 11.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M6.5 9H9.5M6.5 11.5H9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotDotsFourIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4.5" cy="11.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="11.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDotsFourFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4.5" cy="11.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="11.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDownloadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5V11M5 8L8 11L11 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 10V12A1.5 1.5 0 0 0 4 13.5H12A1.5 1.5 0 0 0 13.5 12V10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDownloadFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 2.688 V 11 M 5.133 8.133 L 8 11 L 10.867 8.133" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 10.188 V 12 A 1.5 1.5 0 0 0 4 13.5 H 12 A 1.5 1.5 0 0 0 13.5 12 V 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotEyeOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 6.5C3.5 10.5 12.5 10.5 14.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9.5V12M4.5 8.912L3 10.662M11.5 8.912L13 10.662" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyeOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 1.5 6.5 C 3.5 10.5 12.5 10.5 14.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 9.5 V 11.813 M 4.5 8.912 L 3.122 10.52 M 11.5 8.912 L 12.878 10.52" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFilterIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.674 8.291A0.75 0.75 0 0 0 9.5 8.772L9.5 12.459A0.75 0.75 0 0 1 8.987 13.171L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFilterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.674 8.291A0.75 0.75 0 0 0 9.5 8.772L9.5 12.459A0.75 0.75 0 0 1 8.987 13.171L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 1.5L11 1.5L8.5 6.5L12.5 6.5L5.5 14.5L7 9L3.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlashFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6 1.5L11 1.5L8.5 6.5L12.5 6.5L5.5 14.5L7 9L3.5 9Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlipIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 5.572A0.75 0.75 0 0 1 3.326 5.091L5.483 7.68A0.5 0.5 0 0 1 5.483 8.32L3.326 10.909A0.75 0.75 0 0 1 2 10.428Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.674 5.091A0.75 0.75 0 0 1 14 5.572L14 10.428A0.75 0.75 0 0 1 12.674 10.909L10.517 8.32A0.5 0.5 0 0 1 10.517 7.68Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlipFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2 5.572A0.75 0.75 0 0 1 3.326 5.091L5.483 7.68A0.5 0.5 0 0 1 5.483 8.32L3.326 10.909A0.75 0.75 0 0 1 2 10.428Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.674 5.091A0.75 0.75 0 0 1 14 5.572L14 10.428A0.75 0.75 0 0 1 12.674 10.909L10.517 8.32A0.5 0.5 0 0 1 10.517 7.68Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlipVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 5.572A0.75 0.75 0 0 1 3.326 5.091L5.483 7.68A0.5 0.5 0 0 1 5.483 8.32L3.326 10.909A0.75 0.75 0 0 1 2 10.428Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.674 5.091A0.75 0.75 0 0 1 14 5.572L14 10.428A0.75 0.75 0 0 1 12.674 10.909L10.517 8.32A0.5 0.5 0 0 1 10.517 7.68Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotFlipVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <path d="M2 5.572A0.75 0.75 0 0 1 3.326 5.091L5.483 7.68A0.5 0.5 0 0 1 5.483 8.32L3.326 10.909A0.75 0.75 0 0 1 2 10.428Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.674 5.091A0.75 0.75 0 0 1 14 5.572L14 10.428A0.75 0.75 0 0 1 12.674 10.909L10.517 8.32A0.5 0.5 0 0 1 10.517 7.68Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 8 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFlowIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 11.5H13.5M11 9L13.5 11.5L11 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlowFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.688 11.5 H 13.5 M 11.133 9.133 L 13.5 11.5 L 11.133 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlowFreeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="4" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlowFreeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="4" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3.5" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlowVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <rect x="2.5" y="2" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 11.5H13.5M11 9L13.5 11.5L11 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotFlowVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="2.5" y="2" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9.5" y="2" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.688 11.5 H 13.5 M 11.133 9.133 L 13.5 11.5 L 11.133 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFlowWrapIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlowWrapFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFolderIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 11V5A1.5 1.5 0 0 1 4 3.5H6.5L8 5H12A1.5 1.5 0 0 1 13.5 6.5V11A1.5 1.5 0 0 1 12 12.5H4A1.5 1.5 0 0 1 2.5 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2.5 11V5A1.5 1.5 0 0 1 4 3.5H6.5L8 5H12A1.5 1.5 0 0 1 13.5 6.5V11A1.5 1.5 0 0 1 12 12.5H4A1.5 1.5 0 0 1 2.5 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotGapIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5H3.5A1.5 1.5 0 0 1 5 4V12A1.5 1.5 0 0 1 3.5 13.5H2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <path d="M13.5 2.5H12.5A1.5 1.5 0 0 0 11 4V12A1.5 1.5 0 0 0 12.5 13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGapFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 2.5 H 3.5 A 1.5 1.5 0 0 1 5 4 V 12 A 1.5 1.5 0 0 1 3.5 13.5 H 2.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.1875" fill="currentColor" />
      <path d="M 13.313 2.5 H 12.5 A 1.5 1.5 0 0 0 11 4 V 12 A 1.5 1.5 0 0 0 12.5 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGapVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M2.5 2.5H3.5A1.5 1.5 0 0 1 5 4V12A1.5 1.5 0 0 1 3.5 13.5H2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <path d="M13.5 2.5H12.5A1.5 1.5 0 0 0 11 4V12A1.5 1.5 0 0 0 12.5 13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotGapVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <path d="M 2.688 2.5 H 3.5 A 1.5 1.5 0 0 1 5 4 V 12 A 1.5 1.5 0 0 1 3.5 13.5 H 2.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.1875" fill="currentColor" />
        <path d="M 13.313 2.5 H 12.5 A 1.5 1.5 0 0 0 11 4 V 12 A 1.5 1.5 0 0 0 12.5 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotHeartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 13.45L2.775 8.225A3.5 3.5 0 0 1 8 3.585A3.5 3.5 0 0 1 13.225 8.225Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHeartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 13.45L2.775 8.225A3.5 3.5 0 0 1 8 3.585A3.5 3.5 0 0 1 13.225 8.225Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M7.553 2.084A1 1 0 0 1 8.447 2.084L12.447 4.084A1 1 0 0 1 12.447 5.873L8.447 7.873A1 1 0 0 1 7.553 7.873L3.553 5.873A1 1 0 0 1 3.553 4.084Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.559L8 11.059L13 8.559" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11.522L8 14.022L13 11.522" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLayersFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.553 2.084A1 1 0 0 1 8.447 2.084L12.447 4.084A1 1 0 0 1 12.447 5.873L8.447 7.873A1 1 0 0 1 7.553 7.873L3.553 5.873A1 1 0 0 1 3.553 4.084Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.168 8.643 L 8 11.059 L 12.832 8.643" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.168 11.606 L 8 14.022 L 12.832 11.606" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotLockIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="7.5" width="9" height="6" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7.5V5.5A3 3 0 0 1 11 5.5V7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 10V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLockFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 10V11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="3.5" y="7.5" width="9" height="6" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 5 7.5 V 5.5 A 3 3 0 0 1 11 5.5 V 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotOpacityIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11" cy="5" r="0.75" fill="currentColor" />
    <circle cx="8" cy="8" r="0.75" fill="currentColor" />
    <circle cx="11" cy="8" r="0.75" fill="currentColor" />
    <circle cx="5" cy="11" r="0.75" fill="currentColor" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    <circle cx="11" cy="11" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotOpacityFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="5" r="0.9375" fill="currentColor" />
      <circle cx="8" cy="8" r="0.9375" fill="currentColor" />
      <circle cx="11" cy="8" r="0.9375" fill="currentColor" />
      <circle cx="5" cy="11" r="0.9375" fill="currentColor" />
      <circle cx="8" cy="11" r="0.9375" fill="currentColor" />
      <circle cx="11" cy="11" r="0.9375" fill="currentColor" />
    </svg>
  );
};

export const PilotOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5H4.5A2 2 0 0 0 2.5 4.5V11.5A2 2 0 0 0 4.5 13.5H11.5A2 2 0 0 0 13.5 11.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 2.5H13.5V5.5M13.5 2.5L8 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 7.813 2.5 H 4.5 A 2 2 0 0 0 2.5 4.5 V 11.5 A 2 2 0 0 0 4.5 13.5 H 11.5 A 2 2 0 0 0 13.5 11.5 V 8.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.688 2.5 H 13.5 V 5.313 M 13.5 2.5 L 8.133 7.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotOptionsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 4.5H8.5M11.5 4.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="4.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11.5H4.5M7.5 11.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOptionsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="10" cy="4.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="11.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 4.5 H 8.5 M 11.5 4.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 11.5 H 4.5 M 7.5 11.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPaddingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="5.5" width="5" height="5" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPaddingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="5.5" y="5.5" width="5" height="5" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPaddingEndsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 5.5V10.5M10.5 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPaddingEndsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 5.5 5.688 V 10.313 M 10.5 5.688 V 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPaddingSidesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5.5V10.5M10.5 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPaddingSidesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.5 5.688 V 10.313 M 10.5 5.688 V 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3.5H4.5A2 2 0 0 0 2.5 5.5V10.5A2 2 0 0 0 4.5 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.5 3.5H4.5A2 2 0 0 0 2.5 5.5V10.5A2 2 0 0 0 4.5 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 3.5H4.5A2 2 0 0 0 2.5 5.5V10.5A2 2 0 0 0 4.5 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M6.5 3.5H4.5A2 2 0 0 0 2.5 5.5V10.5A2 2 0 0 0 4.5 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPencilIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.293 2.207A1 1 0 0 1 11.707 2.207L13.75 4.25A1 1 0 0 1 13.707 5.705L5.585 12.924A0.5 0.5 0 0 1 5.39 13.031L3.091 13.688A0.75 0.75 0 0 1 2.141 12.874L2.479 10.17A0.5 0.5 0 0 1 2.621 9.879Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPencilFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M10.293 2.207A1 1 0 0 1 11.707 2.207L13.75 4.25A1 1 0 0 1 13.707 5.705L5.585 12.924A0.5 0.5 0 0 1 5.39 13.031L3.091 13.688A0.75 0.75 0 0 1 2.141 12.874L2.479 10.17A0.5 0.5 0 0 1 2.621 9.879Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPersonIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="4.5" r="2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 14V13.5A3.5 3.5 0 0 1 6.5 10H9.5A3.5 3.5 0 0 1 13 13.5V14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="4.5" r="2.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14V13.5A3.5 3.5 0 0 1 6.5 10H9.5A3.5 3.5 0 0 1 13 13.5V14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPinIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.603 13.682A0.75 0.75 0 0 1 7.397 13.682L4.178 9.32A4.75 4.75 0 1 1 11.822 9.32Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="6.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPinFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="6.5" r="2" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8.603 13.682A0.75 0.75 0 0 1 7.397 13.682L4.178 9.32A4.75 4.75 0 1 1 11.822 9.32Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M 3 5.5 A 5.59 5.59 0 1 1 2.746 9.91" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3 2.688 V 5.5 H 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotRotateIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 8.057A1 1 0 0 1 8.707 8.057L10.793 10.143A1 1 0 0 1 10.793 11.557L8.707 13.643A1 1 0 0 1 7.293 13.643L5.207 11.557A1 1 0 0 1 5.207 10.143Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 5A6.364 6.364 0 0 1 12.5 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 2V5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRotateFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.293 8.057A1 1 0 0 1 8.707 8.057L10.793 10.143A1 1 0 0 1 10.793 11.557L8.707 13.643A1 1 0 0 1 7.293 13.643L5.207 11.557A1 1 0 0 1 5.207 10.143Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.726 4.785 A 6.364 6.364 0 0 1 12.5 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.5 2.188 V 5 H 9.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.031 4.25A3.5 3.5 0 1 0 4.25 9.031" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShapesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.926 4.079 A 3.5 3.5 0 1 0 4.079 8.926" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSlidersIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M2 4.5H8.5M11.5 4.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="4.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11.5H4.5M7.5 11.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotSlidersFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <circle cx="10" cy="4.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="11.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.188 4.5 H 8.5 M 11.5 4.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.188 11.5 H 4.5 M 7.5 11.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSortIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 13V3.5M2 6L4.5 3.5L7 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 3V12.5M9 10L11.5 12.5L14 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSortFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.5 12.813 V 3.5 M 2.133 5.867 L 4.5 3.5 L 6.867 5.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.5 3.188 V 12.5 M 9.133 10.133 L 11.5 12.5 L 13.867 10.133" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSparkleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7 4Q7.6 8.4 12 9Q7.6 9.6 7 14Q6.4 9.6 2 9Q6.4 8.4 7 4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 1.75V5.25M10.75 3.5H14.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSparkleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7 4Q7.6 8.4 12 9Q7.6 9.6 7 14Q6.4 9.6 2 9Q6.4 8.4 7 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.5 1.938 V 5.063 M 10.938 3.5 H 14.063" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSquareDashedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4.5V4A1.5 1.5 0 0 1 4 2.5H4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 2.5H12A1.5 1.5 0 0 1 13.5 4V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 11.5V12A1.5 1.5 0 0 1 12 13.5H11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 13.5H4A1.5 1.5 0 0 1 2.5 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 2.5H9M13.5 7V9M9 13.5H7M2.5 9V7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSquareDashedFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 4.313 V 4 A 1.5 1.5 0 0 1 4 2.5 H 4.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.688 2.5 H 12 A 1.5 1.5 0 0 1 13.5 4 V 4.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13.5 11.688 V 12 A 1.5 1.5 0 0 1 12 13.5 H 11.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.313 13.5 H 4 A 1.5 1.5 0 0 1 2.5 12 V 11.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7.188 2.5 H 8.813 M 13.5 7.188 V 8.813 M 8.813 13.5 H 7.188 M 2.5 8.813 V 7.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.072 3.261A1 1 0 0 1 8.928 3.261L9.797 5.425A0.5 0.5 0 0 0 10.227 5.737L12.553 5.895A1 1 0 0 1 13.127 7.66L11.338 9.155A0.5 0.5 0 0 0 11.173 9.661L11.742 11.922A1 1 0 0 1 10.241 13.013L8.266 11.773A0.5 0.5 0 0 0 7.734 11.773L5.759 13.013A1 1 0 0 1 4.258 11.922L4.827 9.661A0.5 0.5 0 0 0 4.662 9.155L2.873 7.66A1 1 0 0 1 3.447 5.895L5.773 5.737A0.5 0.5 0 0 0 6.203 5.425Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStarFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.072 3.261A1 1 0 0 1 8.928 3.261L9.797 5.425A0.5 0.5 0 0 0 10.227 5.737L12.553 5.895A1 1 0 0 1 13.127 7.66L11.338 9.155A0.5 0.5 0 0 0 11.173 9.661L11.742 11.922A1 1 0 0 1 10.241 13.013L8.266 11.773A0.5 0.5 0 0 0 7.734 11.773L5.759 13.013A1 1 0 0 1 4.258 11.922L4.827 9.661A0.5 0.5 0 0 0 4.662 9.155L2.873 7.66A1 1 0 0 1 3.447 5.895L5.773 5.737A0.5 0.5 0 0 0 6.203 5.425Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M3 4.5V2.5H13V4.5M8 2.5V13.5M6 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3 4.313 V 2.5 H 13 V 4.313 M 8 2.5 V 13.5 M 6.188 13.5 H 9.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTokenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="3.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTokenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="3.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTrashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 4.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 4.5V2.5A1 1 0 0 1 7.5 1.5H8.5A1 1 0 0 1 9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.5V13A1.5 1.5 0 0 0 5 14.5H11A1.5 1.5 0 0 0 12.5 13V4.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M3.5 4.5V13A1.5 1.5 0 0 0 5 14.5H11A1.5 1.5 0 0 0 12.5 13V4.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 3.188 4.5 H 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.5 4.5 V 2.5 A 1 1 0 0 1 7.5 1.5 H 8.5 A 1 1 0 0 1 9.5 2.5 V 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUploadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 11V3M5 6L8 3L11 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 10V12A1.5 1.5 0 0 0 4 13.5H12A1.5 1.5 0 0 0 13.5 12V10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUploadFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 10.813 V 3 M 5.133 5.867 L 8 3 L 10.867 5.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 10.188 V 12 A 1.5 1.5 0 0 0 4 13.5 H 12 A 1.5 1.5 0 0 0 13.5 12 V 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotWarningIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.895 2.837A1.25 1.25 0 0 1 9.105 2.837L13.779 11.665A1.25 1.25 0 0 1 12.674 13.5L3.326 13.5A1.25 1.25 0 0 1 2.221 11.665Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M6.895 2.837A1.25 1.25 0 0 1 9.105 2.837L13.779 11.665A1.25 1.25 0 0 1 12.674 13.5L3.326 13.5A1.25 1.25 0 0 1 2.221 11.665Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = [{"id":"batch-1","title":"Batch 1 · Core","icons":{"add":"approved","arrow-up":"approved","bell":"review","check":"approved","chevron-down":"approved","copy":"review","dismiss":"approved","document":"review","eye":"approved","folder":"review","info":"approved","link":"approved","more-horizontal":"approved","open":"review","person":"review","reset":"review","search":"approved","settings":"approved","status-available":"approved","trash":"review","warning":"review"}},{"id":"batch-2","title":"Batch 2 · Alignment","icons":{"align-left":"review","align-center":"review"}},{"id":"batch-3","title":"Batch 3 · Docs chrome","icons":{"expand":"review","panel-left":"review","book":"review","options":"review","color":"review","text":"review","shapes":"review","list":"review","square-dashed":"review","layers":"review","flash":"review"}},{"id":"batch-4","title":"Batch 4 · Inspector","icons":{"angle":"review","aspect-ratio":"review","auto-layout":"review","corner":"review","corners":"review","dots-four":"review","eye-off":"review","flip":"review","flow":"review","flow-wrap":"review","flow-free":"review","gap":"review","opacity":"review","padding":"review","padding-sides":"review","token":"review","rotate":"review"}},{"id":"batch-5","title":"Batch 5 · Common","icons":{"lock":"review","star":"review","heart":"review","calendar":"review","clock":"review","pencil":"review","download":"review","upload":"review","filter":"review","sort":"review","sparkle":"review","pin":"review"}}] as const;

export const PILOT_ICONS = [
  { name: "add", keyline: "square", derivedFrom: undefined, Icon: PilotAddIcon, Filled: PilotAddFilledIcon, fill: "weight" },
  { name: "align-bottom", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignBottomIcon, Filled: PilotAlignBottomFilledIcon, fill: "solid" },
  { name: "align-center", keyline: "square", derivedFrom: undefined, Icon: PilotAlignCenterIcon, Filled: PilotAlignCenterFilledIcon, fill: "solid" },
  { name: "align-left", keyline: "square", derivedFrom: undefined, Icon: PilotAlignLeftIcon, Filled: PilotAlignLeftFilledIcon, fill: "solid" },
  { name: "align-middle", keyline: "square", derivedFrom: "align-center", Icon: PilotAlignMiddleIcon, Filled: PilotAlignMiddleFilledIcon, fill: "solid" },
  { name: "align-right", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignRightIcon, Filled: PilotAlignRightFilledIcon, fill: "solid" },
  { name: "align-top", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignTopIcon, Filled: PilotAlignTopFilledIcon, fill: "solid" },
  { name: "angle", keyline: "square", derivedFrom: undefined, Icon: PilotAngleIcon, Filled: PilotAngleFilledIcon, fill: "weight" },
  { name: "arrow-down", keyline: "vertical", derivedFrom: "arrow-up", Icon: PilotArrowDownIcon, Filled: PilotArrowDownFilledIcon, fill: "weight" },
  { name: "arrow-left", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowLeftIcon, Filled: PilotArrowLeftFilledIcon, fill: "weight" },
  { name: "arrow-right", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowRightIcon, Filled: PilotArrowRightFilledIcon, fill: "weight" },
  { name: "arrow-up", keyline: "vertical", derivedFrom: undefined, Icon: PilotArrowUpIcon, Filled: PilotArrowUpFilledIcon, fill: "weight" },
  { name: "aspect-ratio", keyline: "square", derivedFrom: undefined, Icon: PilotAspectRatioIcon, Filled: PilotAspectRatioFilledIcon, fill: "solid" },
  { name: "auto-layout", keyline: "square", derivedFrom: undefined, Icon: PilotAutoLayoutIcon, Filled: PilotAutoLayoutFilledIcon, fill: "solid" },
  { name: "bell", keyline: "square", derivedFrom: undefined, Icon: PilotBellIcon, Filled: PilotBellFilledIcon, fill: "solid" },
  { name: "book", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBookIcon, Filled: PilotBookFilledIcon, fill: "solid" },
  { name: "calendar", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarIcon, Filled: PilotCalendarFilledIcon, fill: "solid" },
  { name: "check", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCheckIcon, Filled: PilotCheckFilledIcon, fill: "weight" },
  { name: "chevron-down", keyline: "horizontal", derivedFrom: undefined, Icon: PilotChevronDownIcon, Filled: PilotChevronDownFilledIcon, fill: "weight" },
  { name: "chevron-left", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronLeftIcon, Filled: PilotChevronLeftFilledIcon, fill: "weight" },
  { name: "chevron-right", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronRightIcon, Filled: PilotChevronRightFilledIcon, fill: "weight" },
  { name: "chevron-up", keyline: "horizontal", derivedFrom: "chevron-down", Icon: PilotChevronUpIcon, Filled: PilotChevronUpFilledIcon, fill: "weight" },
  { name: "clock", keyline: "circle", derivedFrom: undefined, Icon: PilotClockIcon, Filled: PilotClockFilledIcon, fill: "solid" },
  { name: "color", keyline: "vertical", derivedFrom: undefined, Icon: PilotColorIcon, Filled: PilotColorFilledIcon, fill: "solid" },
  { name: "copy", keyline: "square", derivedFrom: undefined, Icon: PilotCopyIcon, Filled: PilotCopyFilledIcon, fill: "solid" },
  { name: "corner", keyline: "square", derivedFrom: undefined, Icon: PilotCornerIcon, Filled: PilotCornerFilledIcon, fill: "weight" },
  { name: "corner-bottom-left", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomLeftIcon, Filled: PilotCornerBottomLeftFilledIcon, fill: "weight" },
  { name: "corner-bottom-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomRightIcon, Filled: PilotCornerBottomRightFilledIcon, fill: "weight" },
  { name: "corner-top-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerTopRightIcon, Filled: PilotCornerTopRightFilledIcon, fill: "weight" },
  { name: "corners", keyline: "square", derivedFrom: undefined, Icon: PilotCornersIcon, Filled: PilotCornersFilledIcon, fill: "weight" },
  { name: "dismiss", keyline: "circle", derivedFrom: undefined, Icon: PilotDismissIcon, Filled: PilotDismissFilledIcon, fill: "weight" },
  { name: "document", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentIcon, Filled: PilotDocumentFilledIcon, fill: "solid" },
  { name: "dots-four", keyline: "square", derivedFrom: undefined, Icon: PilotDotsFourIcon, Filled: PilotDotsFourFilledIcon, fill: "solid" },
  { name: "download", keyline: "square", derivedFrom: undefined, Icon: PilotDownloadIcon, Filled: PilotDownloadFilledIcon, fill: "weight" },
  { name: "expand", keyline: "square", derivedFrom: undefined, Icon: PilotExpandIcon, Filled: PilotExpandFilledIcon, fill: "weight" },
  { name: "eye", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeIcon, Filled: PilotEyeFilledIcon, fill: "solid" },
  { name: "eye-off", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeOffIcon, Filled: PilotEyeOffFilledIcon, fill: "weight" },
  { name: "filter", keyline: "square", derivedFrom: undefined, Icon: PilotFilterIcon, Filled: PilotFilterFilledIcon, fill: "solid" },
  { name: "flash", keyline: "vertical", derivedFrom: undefined, Icon: PilotFlashIcon, Filled: PilotFlashFilledIcon, fill: "solid" },
  { name: "flip", keyline: "square", derivedFrom: undefined, Icon: PilotFlipIcon, Filled: PilotFlipFilledIcon, fill: "solid" },
  { name: "flip-vertical", keyline: "square", derivedFrom: "flip", Icon: PilotFlipVerticalIcon, Filled: PilotFlipVerticalFilledIcon, fill: "solid" },
  { name: "flow", keyline: "square", derivedFrom: undefined, Icon: PilotFlowIcon, Filled: PilotFlowFilledIcon, fill: "solid" },
  { name: "flow-free", keyline: "square", derivedFrom: undefined, Icon: PilotFlowFreeIcon, Filled: PilotFlowFreeFilledIcon, fill: "solid" },
  { name: "flow-vertical", keyline: "square", derivedFrom: "flow", Icon: PilotFlowVerticalIcon, Filled: PilotFlowVerticalFilledIcon, fill: "solid" },
  { name: "flow-wrap", keyline: "square", derivedFrom: undefined, Icon: PilotFlowWrapIcon, Filled: PilotFlowWrapFilledIcon, fill: "solid" },
  { name: "folder", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderIcon, Filled: PilotFolderFilledIcon, fill: "solid" },
  { name: "gap", keyline: "square", derivedFrom: undefined, Icon: PilotGapIcon, Filled: PilotGapFilledIcon, fill: "weight" },
  { name: "gap-vertical", keyline: "square", derivedFrom: "gap", Icon: PilotGapVerticalIcon, Filled: PilotGapVerticalFilledIcon, fill: "weight" },
  { name: "heart", keyline: "circle", derivedFrom: undefined, Icon: PilotHeartIcon, Filled: PilotHeartFilledIcon, fill: "solid" },
  { name: "info", keyline: "circle", derivedFrom: undefined, Icon: PilotInfoIcon, Filled: PilotInfoFilledIcon, fill: "solid" },
  { name: "layers", keyline: "square", derivedFrom: undefined, Icon: PilotLayersIcon, Filled: PilotLayersFilledIcon, fill: "solid" },
  { name: "link", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLinkIcon, Filled: PilotLinkFilledIcon, fill: "weight" },
  { name: "list", keyline: "horizontal", derivedFrom: undefined, Icon: PilotListIcon, Filled: PilotListFilledIcon, fill: "weight" },
  { name: "lock", keyline: "vertical", derivedFrom: undefined, Icon: PilotLockIcon, Filled: PilotLockFilledIcon, fill: "solid" },
  { name: "more-horizontal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMoreHorizontalIcon, Filled: PilotMoreHorizontalFilledIcon, fill: "weight" },
  { name: "opacity", keyline: "square", derivedFrom: undefined, Icon: PilotOpacityIcon, Filled: PilotOpacityFilledIcon, fill: "weight" },
  { name: "open", keyline: "square", derivedFrom: undefined, Icon: PilotOpenIcon, Filled: PilotOpenFilledIcon, fill: "weight" },
  { name: "options", keyline: "square", derivedFrom: undefined, Icon: PilotOptionsIcon, Filled: PilotOptionsFilledIcon, fill: "solid" },
  { name: "padding", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingIcon, Filled: PilotPaddingFilledIcon, fill: "solid" },
  { name: "padding-ends", keyline: "square", derivedFrom: "padding-sides", Icon: PilotPaddingEndsIcon, Filled: PilotPaddingEndsFilledIcon, fill: "weight" },
  { name: "padding-sides", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingSidesIcon, Filled: PilotPaddingSidesFilledIcon, fill: "weight" },
  { name: "panel-left", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelLeftIcon, Filled: PilotPanelLeftFilledIcon, fill: "solid" },
  { name: "panel-right", keyline: "horizontal", derivedFrom: "panel-left", Icon: PilotPanelRightIcon, Filled: PilotPanelRightFilledIcon, fill: "solid" },
  { name: "pencil", keyline: "square", derivedFrom: undefined, Icon: PilotPencilIcon, Filled: PilotPencilFilledIcon, fill: "solid" },
  { name: "person", keyline: "vertical", derivedFrom: undefined, Icon: PilotPersonIcon, Filled: PilotPersonFilledIcon, fill: "solid" },
  { name: "pin", keyline: "vertical", derivedFrom: undefined, Icon: PilotPinIcon, Filled: PilotPinFilledIcon, fill: "solid" },
  { name: "reset", keyline: "circle", derivedFrom: undefined, Icon: PilotResetIcon, Filled: PilotResetFilledIcon, fill: "weight" },
  { name: "rotate", keyline: "square", derivedFrom: undefined, Icon: PilotRotateIcon, Filled: PilotRotateFilledIcon, fill: "solid" },
  { name: "search", keyline: "circle", derivedFrom: undefined, Icon: PilotSearchIcon, Filled: PilotSearchFilledIcon, fill: "weight" },
  { name: "settings", keyline: "circle", derivedFrom: undefined, Icon: PilotSettingsIcon, Filled: PilotSettingsFilledIcon, fill: "solid" },
  { name: "shapes", keyline: "square", derivedFrom: undefined, Icon: PilotShapesIcon, Filled: PilotShapesFilledIcon, fill: "solid" },
  { name: "sliders", keyline: "square", derivedFrom: "options", Icon: PilotSlidersIcon, Filled: PilotSlidersFilledIcon, fill: "solid" },
  { name: "sort", keyline: "square", derivedFrom: undefined, Icon: PilotSortIcon, Filled: PilotSortFilledIcon, fill: "weight" },
  { name: "sparkle", keyline: "circle", derivedFrom: undefined, Icon: PilotSparkleIcon, Filled: PilotSparkleFilledIcon, fill: "solid" },
  { name: "square-dashed", keyline: "square", derivedFrom: undefined, Icon: PilotSquareDashedIcon, Filled: PilotSquareDashedFilledIcon, fill: "weight" },
  { name: "star", keyline: "circle", derivedFrom: undefined, Icon: PilotStarIcon, Filled: PilotStarFilledIcon, fill: "solid" },
  { name: "status-available", keyline: "circle", derivedFrom: undefined, Icon: PilotStatusAvailableIcon, Filled: PilotStatusAvailableFilledIcon, fill: "solid" },
  { name: "text", keyline: "square", derivedFrom: undefined, Icon: PilotTextIcon, Filled: PilotTextFilledIcon, fill: "weight" },
  { name: "token", keyline: "circle", derivedFrom: undefined, Icon: PilotTokenIcon, Filled: PilotTokenFilledIcon, fill: "solid" },
  { name: "trash", keyline: "vertical", derivedFrom: undefined, Icon: PilotTrashIcon, Filled: PilotTrashFilledIcon, fill: "solid" },
  { name: "upload", keyline: "square", derivedFrom: undefined, Icon: PilotUploadIcon, Filled: PilotUploadFilledIcon, fill: "weight" },
  { name: "warning", keyline: "circle", derivedFrom: undefined, Icon: PilotWarningIcon, Filled: PilotWarningFilledIcon, fill: "solid" },
] as const;
