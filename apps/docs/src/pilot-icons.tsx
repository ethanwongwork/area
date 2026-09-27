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

export const PilotArchiveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="3" width="13" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6V11.5A1.5 1.5 0 0 0 4 13H12A1.5 1.5 0 0 0 13.5 11.5V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 9H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotArchiveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 6L2.5 6H13.5L15.5 6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M6.5 9H9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="1.5" y="3" width="13" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 6V11.5A1.5 1.5 0 0 0 4 13H12A1.5 1.5 0 0 0 13.5 11.5V6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotAtIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 5V9.5A1.5 1.5 0 0 0 14 9.5V8A6 6 0 1 0 11 13.196" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAtFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11 5.188 V 9.5 A 1.5 1.5 0 0 0 14 9.5 V 8 A 6 6 0 1 0 10.565 13.424" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAttachIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.905 6.345L3.672 11.578A1.5 1.5 0 0 0 5.794 13.699L12.511 6.982A3 3 0 0 0 8.269 2.739L2.612 8.396" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAttachFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8.772 6.478 L 3.672 11.578 A 1.5 1.5 0 0 0 5.794 13.699 L 12.511 6.982 A 3 3 0 0 0 8.269 2.739 L 2.745 8.263" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAutoLayoutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12L10.5 13.5L13.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAutoLayoutFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="11" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.133 12.133 L 10.5 13.5 L 13.367 10.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBackspaceIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.707 7.293L6.207 3.793A1 1 0 0 1 6.914 3.5L12 3.5A2 2 0 0 1 14 5.5L14 10.5A2 2 0 0 1 12 12.5L6.914 12.5A1 1 0 0 1 6.207 12.207L2.707 8.707A1 1 0 0 1 2.707 7.293Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.25 6.25L11.75 9.75M11.75 6.25L8.25 9.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBackspaceFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8.25 6.25L11.75 9.75M11.75 6.25L8.25 9.75" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.707 7.293L6.207 3.793A1 1 0 0 1 6.914 3.5L12 3.5A2 2 0 0 1 14 5.5L14 10.5A2 2 0 0 1 12 12.5L6.914 12.5A1 1 0 0 1 6.207 12.207L2.707 8.707A1 1 0 0 1 2.707 7.293Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBatteryIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="4.5" width="11" height="7" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 6.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBatteryFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="1.5" y="4.5" width="11" height="7" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 14.5 6.688 V 9.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotBellOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.5 11.5L3 11.5A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8L3.5 6.5A4.5 4.5 0 0 1 4.158 4.158M5.772 2.59A4.5 4.5 0 0 1 12.5 6.5L12.5 8C12.5 8.793 12.779 9.376 13.043 9.861" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5L6 12A2 2 0 0 0 10 12L10 11.5L6 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBellOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4 12.625H12" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8C12.5 9.5 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 2.133 2.133 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBluetoothIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 5L12 11L8 14V2L12 5L4 11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBluetoothFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.15 5.112 L 12 11 L 8 14 V 2 L 12 5 L 4.15 10.887" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBoldIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2H8.5A3.5 3.5 0 0 1 11.175 7.758A3.5 3.5 0 0 1 9 14H4.5A1 1 0 0 1 3.5 13V3A1 1 0 0 1 4.5 2ZM5.5 4H8.5A1.5 1.5 0 0 1 8.5 7H5.5ZM5.5 9H9A1.5 1.5 0 0 1 9 12H5.5Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

export const PilotBoldFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 2H8.5A3.5 3.5 0 0 1 11.175 7.758A3.5 3.5 0 0 1 9 14H4.5A1 1 0 0 1 3.5 13V3A1 1 0 0 1 4.5 2ZM5.5 4H8.5A1.5 1.5 0 0 1 8.5 7H5.5ZM5.5 9H9A1.5 1.5 0 0 1 9 12H5.5Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
};

export const PilotBookIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 5.5C7.5 3.3 4 2.5 2 4V11.5C4 10.2 7.5 10.8 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5.5C8.5 3.3 12 2.5 14 4V11.5C12 10.2 8.5 10.8 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5.5V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBookFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 3.5L8 5.5V13L8 15" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8 5.5C7.5 3.3 4 2.5 2 4V11.5C4 10.2 7.5 10.8 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 5.5C8.5 3.3 12 2.5 14 4V11.5C12 10.2 8.5 10.8 8 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBookmarkIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBookmarkFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBriefcaseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="5" width="12" height="8.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5V3.5A1.5 1.5 0 0 1 7 2H9A1.5 1.5 0 0 1 10.5 3.5V5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9.5H7M9 9.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="8" width="2" height="3" rx="0.5" fill="currentColor" />
  </svg>
);

export const PilotBriefcaseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 9.5L2 9.5H7M9 9.5H14L16 9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <rect x="7" y="8" width="2" height="3" rx="0.5" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="5" width="12" height="8.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 5.5 5 V 3.5 A 1.5 1.5 0 0 1 7 2 H 9 A 1.5 1.5 0 0 1 10.5 3.5 V 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBugIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 6A1.5 1.5 0 0 1 6.5 4.5H9.5A1.5 1.5 0 0 1 11 6V9.5A3 3 0 0 1 5 9.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 2V3.5A1 1 0 0 0 9 3.5V2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 6A2 2 0 0 1 3 4V2.5M11 6A2 2 0 0 0 13 4V2.5M2.5 8.5H5M11 8.5H13.5M5.402 11A2.402 2.402 0 0 0 3 13.402V14M10.598 11A2.402 2.402 0 0 1 13 13.402V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBugFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 6A1.5 1.5 0 0 1 6.5 4.5H9.5A1.5 1.5 0 0 1 11 6V9.5A3 3 0 0 1 5 9.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7 2.188 V 3.5 A 1 1 0 0 0 9 3.5 V 2.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5 6 A 2 2 0 0 1 3 4 V 2.688 M 11 6 A 2 2 0 0 0 13 4 V 2.688 M 2.688 8.5 H 5 M 11 8.5 H 13.313 M 5.402 11 A 2.402 2.402 0 0 0 3 13.402 V 13.813 M 10.598 11 A 2.402 2.402 0 0 1 13 13.402 V 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBuildingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3" y="1.5" width="10" height="12.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="4.5" r="1" fill="currentColor" />
    <circle cx="10" cy="4.5" r="1" fill="currentColor" />
    <circle cx="6" cy="8" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <path d="M6.5 14V12.5A1.5 1.5 0 0 1 9.5 12.5V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBuildingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6" cy="4.5" r="1" fill="black" />
        <circle cx="10" cy="4.5" r="1" fill="black" />
        <circle cx="6" cy="8" r="1" fill="black" />
        <circle cx="10" cy="8" r="1" fill="black" />
        <path d="M6.5 14V12.5A1.5 1.5 0 0 1 9.5 12.5V14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="3" y="1.5" width="10" height="12.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCalculatorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2" width="11" height="12" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="8.25" r="0.75" fill="currentColor" />
    <circle cx="5" cy="11.5" r="0.75" fill="currentColor" />
    <circle cx="8" cy="8.25" r="0.75" fill="currentColor" />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    <circle cx="11" cy="8.25" r="0.75" fill="currentColor" />
    <circle cx="11" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotCalculatorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 5H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5" cy="8.25" r="0.75" fill="black" />
        <circle cx="5" cy="11.5" r="0.75" fill="black" />
        <circle cx="8" cy="8.25" r="0.75" fill="black" />
        <circle cx="8" cy="11.5" r="0.75" fill="black" />
        <circle cx="11" cy="8.25" r="0.75" fill="black" />
        <circle cx="11" cy="11.5" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2" width="11" height="12" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCameraIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 6.5A2 2 0 0 1 4 4.5H5.5L7 3H9L10.5 4.5H12A2 2 0 0 1 14 6.5V11A2 2 0 0 1 12 13H4A2 2 0 0 1 2 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCameraFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8.5" r="2" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 6.5A2 2 0 0 1 4 4.5H5.5L7 3H9L10.5 4.5H12A2 2 0 0 1 14 6.5V11A2 2 0 0 1 12 13H4A2 2 0 0 1 2 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="6.5" width="11" height="5.5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6.5L4.336 3.814A1.5 1.5 0 0 1 5.824 2.5L10.176 2.5A1.5 1.5 0 0 1 11.664 3.814L12 6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.125 5.5H2.5M11.875 5.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.25" cy="9.25" r="0.75" fill="currentColor" />
    <circle cx="10.75" cy="9.25" r="0.75" fill="currentColor" />
    <path d="M4.5 12V13.5M11.5 12V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCarFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="5.25" cy="9.25" r="0.75" fill="black" />
        <circle cx="10.75" cy="9.25" r="0.75" fill="black" />
        <path d="M0 6.5H16" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="6.5" width="11" height="5.5" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6.5L4.336 3.814A1.5 1.5 0 0 1 5.824 2.5L10.176 2.5A1.5 1.5 0 0 1 11.664 3.814L12 6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 4.125 5.5 H 2.688 M 11.875 5.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.5 12 V 13.313 M 11.5 12 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 2.5L2.853 2.5A0.5 0.5 0 0 1 3.34 2.886L4.82 9.227A1 1 0 0 0 5.794 10L11.736 10A1 1 0 0 0 12.701 9.263L13.828 5.132A0.5 0.5 0 0 0 13.345 4.5L3.72 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="13" r="1" fill="currentColor" />
    <circle cx="11" cy="13" r="1" fill="currentColor" />
  </svg>
);

export const PilotCartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.188 2.5 L 2.853 2.5 A 0.5 0.5 0 0 1 3.34 2.886 L 4.82 9.227 A 1 1 0 0 0 5.794 10 L 11.736 10 A 1 1 0 0 0 12.701 9.263 L 13.828 5.132 A 0.5 0.5 0 0 0 13.345 4.5 L 3.908 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="13" r="1.1875" fill="currentColor" />
      <circle cx="11" cy="13" r="1.1875" fill="currentColor" />
    </svg>
  );
};

export const PilotChartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 11L7.5 8.5L9.5 10.5L13.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 2.688 V 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.133 10.867 L 7.5 8.5 L 9.5 10.5 L 13.367 6.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotChatIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 12.689L2.5 4.5A2 2 0 0 1 4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 9.5A2 2 0 0 1 11.5 11.5L5.707 11.5A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChatFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 12.689L2.5 4.5A2 2 0 0 1 4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 9.5A2 2 0 0 1 11.5 11.5L5.707 11.5A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotClipboardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.5 3H11A2 2 0 0 1 13 5V12A2 2 0 0 1 11 14H5A2 2 0 0 1 3 12V5A2 2 0 0 1 5 3H5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="1.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotClipboardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.375 2V3.5A2.125 2.125 0 0 0 6.5 5.625H9.5A2.125 2.125 0 0 0 11.625 3.5V2" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5 3H11A2 2 0 0 1 13 5V12A2 2 0 0 1 11 14H5A2 2 0 0 1 3 12V5A2 2 0 0 1 5 3Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5.5" y="1.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotClockIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCloudIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 1 1 11 12.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 1 1 11 12.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCloudUploadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.75 12.5L4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 0 1 11 12.5L10.25 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14V7.75M5.5 10.25L8 7.75L10.5 10.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudUploadFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 14V7.75M5.5 10.25L8 7.75L10.5 10.25" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 1 1 11 12.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCodeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 4L2 8L6 12M10 4L14 8L10 12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCodeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.867 4.133 L 2 8 L 5.867 11.867 M 10.133 4.133 L 14 8 L 10.133 11.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCoffeeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 8H10.5V11A3 3 0 0 1 7.5 14H5A3 3 0 0 1 2 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 9H12A1.75 1.75 0 0 1 12 12.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.25 2C4.75 3 1.75 4 3.25 5M6.25 2C7.75 3 4.75 4 6.25 5M9.25 2C10.75 3 7.75 4 9.25 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCoffeeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2 8H10.5V11A3 3 0 0 1 7.5 14H5A3 3 0 0 1 2 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.5 9 H 12 A 1.75 1.75 0 0 1 12 12.5 H 10.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.25 2 C 4.75 3 1.75 4 3.25 5 M 6.25 2 C 7.75 3 4.75 4 6.25 5 M 9.25 2 C 10.75 3 7.75 4 9.25 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCommandIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.5 4V12A1.5 1.5 0 1 0 12 10.5H4A1.5 1.5 0 1 0 5.5 12V4A1.5 1.5 0 1 0 4 5.5H12A1.5 1.5 0 1 0 10.5 4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCommandFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M10.5 4V12A1.5 1.5 0 1 0 12 10.5H4A1.5 1.5 0 1 0 5.5 12V4A1.5 1.5 0 1 0 4 5.5H12A1.5 1.5 0 1 0 10.5 4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCompassIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.291 5.313L8.439 6.189A2.5 2.5 0 0 1 9.811 7.561L10.687 9.709A0.75 0.75 0 0 1 9.709 10.687L7.561 9.811A2.5 2.5 0 0 1 6.189 8.439L5.313 6.291A0.75 0.75 0 0 1 6.291 5.313Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCompassFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.291 5.313L8.439 6.189A2.5 2.5 0 0 1 9.811 7.561L10.687 9.709A0.75 0.75 0 0 1 9.709 10.687L7.561 9.811A2.5 2.5 0 0 1 6.189 8.439L5.313 6.291A0.75 0.75 0 0 1 6.291 5.313Z" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotCreditCardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 9.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCreditCardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 6.5L2 6.5H14L16 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M4.5 9.5H6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCropIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2V11.5H14M2 4.5H11.5V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCropFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.5 2.188 V 11.5 H 13.813 M 2.188 4.5 H 11.5 V 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDatabaseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4A5.5 2 0 0 1 13.5 4A5.5 2 0 0 1 2.5 4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 4V12A5.5 2 0 0 0 13.5 12V4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8A5.5 2 0 0 0 13.5 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDatabaseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1 4H2.5A5.5 2 0 0 0 13.5 4H15M1 8H2.5A5.5 2 0 0 0 13.5 8H15" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.5 4A5.5 2 0 0 1 13.5 4A5.5 2 0 0 1 2.5 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 4V12A5.5 2 0 0 0 13.5 12V4" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotDesktopIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V13.5M5.5 13.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDesktopFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 11 V 13.5 M 5.688 13.5 H 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotErrorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotErrorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotEyeOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 5.5C3.5 9.5 12.5 9.5 14.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8.5V11M4.5 7.912L3 9.662M11.5 7.912L13 9.662" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyeOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 1.5 5.5 C 3.5 9.5 12.5 9.5 14.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 8.5 V 10.813 M 4.5 7.912 L 3.122 9.52 M 11.5 7.912 L 12.878 9.52" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotEyedropperIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.304 13.152L2.427 11.805L8.084 6.149L9.851 7.916L4.195 13.573L2.848 13.696A0.5 0.5 0 0 1 2.304 13.152Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.73 5.795L10.735 2.79A1.75 1.75 0 0 1 13.21 2.79L13.21 2.79A1.75 1.75 0 0 1 13.21 5.265L10.205 8.27L7.73 5.795Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.846 4.911L11.089 9.154" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyedropperFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.304 13.152L2.427 11.805L8.084 6.149L9.851 7.916L4.195 13.573L2.848 13.696A0.5 0.5 0 0 1 2.304 13.152Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.73 5.795L10.735 2.79A1.75 1.75 0 0 1 13.21 2.79L13.21 2.79A1.75 1.75 0 0 1 13.21 5.265L10.205 8.27L7.73 5.795Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.979 5.044 L 10.956 9.021" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFilmIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 2V14M11 2V14M2 5H5M2 8H14M2 11H5M11 5H14M11 11H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFilmFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 2V14M11 2V14M2 5H5M2 8H14M2 11H5M11 5H14M11 11H14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotFlagIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 8.5L2.5 2.5L13.5 2.5L10.854 5.146A0.5 0.5 0 0 0 10.854 5.854L13.5 8.5L2.5 8.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlagFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 8.5L2.5 2.5L13.5 2.5L10.854 5.146A0.5 0.5 0 0 0 10.854 5.854L13.5 8.5L2.5 8.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 2.5 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <rect x="4" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlowFreeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="4" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M2 11.5V4.5A1.5 1.5 0 0 1 3.5 3H7L8.5 4.5H12.5A1.5 1.5 0 0 1 14 6V11.5A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6H7L8.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 6L2 6H7L8.5 4.5L9.914 3.086" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 11.5V4.5A1.5 1.5 0 0 1 3.5 3H7L8.5 4.5H12.5A1.5 1.5 0 0 1 14 6V11.5A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotGiftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="5.5" width="11" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 8.5V12A1.5 1.5 0 0 0 5 13.5H11A1.5 1.5 0 0 0 12.5 12V8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 8.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5.5C6.5 5.5 4.5 5.2 4.5 3.75A1.25 1.25 0 0 1 5.75 2.5C7 2.5 8 4 8 5.5C8 4 9 2.5 10.25 2.5A1.25 1.25 0 0 1 11.5 3.75C11.5 5.2 9.5 5.5 8 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGiftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1.5 8.5L3.5 8.5H12.5L14.5 8.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M8 3.5L8 5.5V13.5L8 15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="5.5" width="11" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 8.5V12A1.5 1.5 0 0 0 5 13.5H11A1.5 1.5 0 0 0 12.5 12V8.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 8 5.5 C 6.5 5.5 4.5 5.2 4.5 3.75 A 1.25 1.25 0 0 1 5.75 2.5 C 7 2.5 8 4 8 5.5 C 8 4 9 2.5 10.25 2.5 A 1.25 1.25 0 0 1 11.5 3.75 C 11.5 5.2 9.5 5.5 8 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGlobeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2A3 6 0 0 1 8 14A3 6 0 0 1 8 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGlobeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 2A3 6 0 0 1 8 14A3 6 0 0 1 8 2Z" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 8H14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotGraduationCapIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.431 3.206L13.431 5.598A1 1 0 0 1 13.431 7.402L8.431 9.794A1 1 0 0 1 7.569 9.794L2.569 7.402A1 1 0 0 1 2.569 5.598L7.569 3.206A1 1 0 0 1 8.431 3.206Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 8.326V11A3.5 2 0 0 0 11.5 11V8.326" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 6.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGraduationCapFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M-0.5 5.934L8 10L16.5 5.934" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8.431 3.206L13.431 5.598A1 1 0 0 1 13.431 7.402L8.431 9.794A1 1 0 0 1 7.569 9.794L2.569 7.402A1 1 0 0 1 2.569 5.598L7.569 3.206A1 1 0 0 1 8.431 3.206Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 4.5 8.326 V 11 A 3.5 2 0 0 0 11.5 11 V 8.326" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 14 6.5 V 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGridIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGridFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5V13.5M10.5 2.5V13.5M2.5 5.5H13.5M2.5 10.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHashFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.5 2.688 V 13.313 M 10.5 2.688 V 13.313 M 2.688 5.5 H 13.313 M 2.688 10.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHeadingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 2.5V13.5M12.5 2.5V13.5M3.5 8H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHeadingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.5 2.688 V 13.313 M 12.5 2.688 V 13.313 M 3.5 8 H 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHeadphonesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 12V8A5.5 5.5 0 0 1 13.5 8V12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 9H4.5A1.5 1.5 0 0 1 6 10.5V12A1.5 1.5 0 0 1 4.5 13.5H4A1.5 1.5 0 0 1 2.5 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 9H11.5A1.5 1.5 0 0 0 10 10.5V12A1.5 1.5 0 0 0 11.5 13.5H12A1.5 1.5 0 0 0 13.5 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHeadphonesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 9H4.5A1.5 1.5 0 0 1 6 10.5V12A1.5 1.5 0 0 1 4.5 13.5H4A1.5 1.5 0 0 1 2.5 12Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 9H11.5A1.5 1.5 0 0 0 10 10.5V12A1.5 1.5 0 0 0 11.5 13.5H12A1.5 1.5 0 0 0 13.5 12Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 12 V 8 A 5.5 5.5 0 0 1 13.5 8 V 12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHeartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 4.5L7 3.5A2.828 2.828 0 1 0 3 8L7.646 12.646A0.5 0.5 0 0 0 8.354 12.646L13 8A2.828 2.828 0 1 0 9 3.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHeartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 4.5L7 3.5A2.828 2.828 0 1 0 3 8L7.646 12.646A0.5 0.5 0 0 0 8.354 12.646L13 8A2.828 2.828 0 1 0 9 3.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHelpIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 6A1.5 1.5 0 1 1 8.75 7.299Q8 7.732 8 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.375" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotHelpFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 6A1.5 1.5 0 1 1 8.75 7.299Q8 7.732 8 8.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="11.375" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotHistoryIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 5.5A5.59 5.59 0 1 1 2.6 9.447" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3V5.5H5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5.5V8H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHistoryFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3 5.5 A 5.59 5.59 0 1 1 2.746 9.91" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3 3.188 V 5.5 H 5.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 5.688 V 8 H 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHomeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 12L2.5 7.707A0.5 0.5 0 0 1 2.646 7.354L7.293 2.707A1 1 0 0 1 8.707 2.707L13.354 7.354A0.5 0.5 0 0 1 13.5 7.707L13.5 12A1.5 1.5 0 0 1 12 13.5L4 13.5A1.5 1.5 0 0 1 2.5 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 13.5V10A1.5 1.5 0 0 1 9.5 10V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHomeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 13.5V10A1.5 1.5 0 0 1 9.5 10V13.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.5 12L2.5 7.707A0.5 0.5 0 0 1 2.646 7.354L7.293 2.707A1 1 0 0 1 8.707 2.707L13.354 7.354A0.5 0.5 0 0 1 13.5 7.707L13.5 12A1.5 1.5 0 0 1 12 13.5L4 13.5A1.5 1.5 0 0 1 2.5 12Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotHourglassIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 2H12.5M3.5 14H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 2V5L8 8L11 5V2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 14V11L8 8L11 11V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHourglassFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 2V5L8 8L11 5V2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14V11L8 8L11 11V14" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.688 2 H 12.313 M 3.688 14 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotImageIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 13.5L9.793 9.207A1 1 0 0 1 11.207 9.207L13.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6.5" cy="6.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotImageFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.086 14.914L5.5 13.5L9.793 9.207A1 1 0 0 1 11.207 9.207L13.5 11.5L14.914 12.914" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <circle cx="6.5" cy="6.5" r="1.5" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotInboxIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 11.5L2 8.581A0.5 0.5 0 0 1 2.026 8.423L3.772 3.184A1 1 0 0 1 4.721 2.5L11.279 2.5A1 1 0 0 1 12.228 3.184L13.974 8.423A0.5 0.5 0 0 1 14 8.581L14 11.5A1.5 1.5 0 0 1 12.5 13L3.5 13A1.5 1.5 0 0 1 2 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8.5H5.5L6.5 10H9.5L10.5 8.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotInboxFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 8.5L2 8.5H5.5L6.5 10H9.5L10.5 8.5H14L16 8.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 11.5L2 8.581A0.5 0.5 0 0 1 2.026 8.423L3.772 3.184A1 1 0 0 1 4.721 2.5L11.279 2.5A1 1 0 0 1 12.228 3.184L13.974 8.423A0.5 0.5 0 0 1 14 8.581L14 11.5A1.5 1.5 0 0 1 12.5 13L3.5 13A1.5 1.5 0 0 1 2 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotInfoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.5V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="4.625" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotInfoFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 7.5V11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="4.625" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotItalicIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 2.5H12.5M3.5 13.5H9.5M9.5 2.5L6.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotItalicFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 6.688 2.5 H 12.313 M 3.688 13.5 H 9.313 M 9.5 2.5 L 6.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotKeyIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="5.5" cy="10.5" r="3" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.621 8.379L13.5 2.5M12.5 3.5L14 5M9.5 6.5L11 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotKeyFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5.5" cy="10.5" r="3" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7.621 8.379 L 13.367 2.633 M 12.5 3.5 L 13.867 4.867 M 9.5 6.5 L 10.867 7.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotKeyboardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2.5" width="12" height="10.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4.5" cy="5" r="0.75" fill="currentColor" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    <circle cx="11.5" cy="5" r="0.75" fill="currentColor" />
    <circle cx="6.25" cy="8" r="0.75" fill="currentColor" />
    <circle cx="9.75" cy="8" r="0.75" fill="currentColor" />
    <path d="M5 10.5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotKeyboardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="4.5" cy="5" r="0.75" fill="black" />
        <circle cx="8" cy="5" r="0.75" fill="black" />
        <circle cx="11.5" cy="5" r="0.75" fill="black" />
        <circle cx="6.25" cy="8" r="0.75" fill="black" />
        <circle cx="9.75" cy="8" r="0.75" fill="black" />
        <path d="M5 10.5H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="2.5" width="12" height="10.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotLightbulbIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 9.37A4 4 0 1 1 10.5 9.37L9.5 11V12.5A1.5 1.5 0 0 1 6.5 12.5V11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 11H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLightbulbFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.5 11L6.5 11H9.5L11.5 11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 9.37A4 4 0 1 1 10.5 9.37L9.5 11V12.5A1.5 1.5 0 0 1 6.5 12.5V11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotLinkOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 5A3 3 0 0 0 5 11L6.5 11M9.5 5L11 5A3 3 0 0 1 13.21 10.028M6 8L8 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLinkOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.133 2.133 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5A3 3 0 0 0 5 11L6.5 11M9.5 5L11 5A3 3 0 0 1 13.372 9.837M6 8L8 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotListIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 3.5H14M2 6.5H14M2 9.5H14M2 12.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.188 3.5 H 13.813 M 2.188 6.5 H 13.813 M 2.188 9.5 H 13.813 M 2.188 12.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotListBulletIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <path d="M6.5 4H13.5M6.5 8H13.5M6.5 12H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListBulletFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="3" cy="4" r="1.1875" fill="currentColor" />
      <circle cx="3" cy="8" r="1.1875" fill="currentColor" />
      <circle cx="3" cy="12" r="1.1875" fill="currentColor" />
      <path d="M 6.688 4 H 13.313 M 6.688 8 H 13.313 M 6.688 12 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLoaderIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M14 8A6 6 0 1 1 10.052 2.362" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLoaderFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 13.981 8.474 A 6 6 0 1 1 9.6 2.218" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotLogInIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M9.5 2.5H11.5A1.5 1.5 0 0 1 13 4V12A1.5 1.5 0 0 1 11.5 13.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8H10M7 5L10 8L7 11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLogInFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 9.688 2.5 H 11.5 A 1.5 1.5 0 0 1 13 4 V 12 A 1.5 1.5 0 0 1 11.5 13.5 H 9.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.688 8 H 10 M 7.133 5.133 L 10 8 L 7.133 10.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLogOutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 2.5H4.5A1.5 1.5 0 0 0 3 4V12A1.5 1.5 0 0 0 4.5 13.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8H13M10 5L13 8L10 11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLogOutFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 6.313 2.5 H 4.5 A 1.5 1.5 0 0 0 3 4 V 12 A 1.5 1.5 0 0 0 4.5 13.5 H 6.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.188 8 H 13 M 10.133 5.133 L 13 8 L 10.133 10.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMailIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 5.5L7.329 8.165A1.5 1.5 0 0 0 8.671 8.165L14 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMailFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.211 4.605L2 5.5L7.329 8.165A1.5 1.5 0 0 0 8.671 8.165L14 5.5L15.789 4.605" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotMapIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4L6.5 2.5L9.5 4L13.5 2.5V12L9.5 13.5L6.5 12L2.5 13.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2.5V12M9.5 4V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMapFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 4L6.5 2.5L9.5 4L13.5 2.5V12L9.5 13.5L6.5 12L2.5 13.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.5 2.5 V 12 M 9.5 4 V 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMegaphoneIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.197 5.778L12.197 2.915A1 1 0 0 1 13.5 3.868L13.5 11.132A1 1 0 0 1 12.197 12.085L3.197 9.222A1 1 0 0 1 2.5 8.269L2.5 6.731A1 1 0 0 1 3.197 5.778Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 9.636V11.5A2 2 0 0 0 8.5 11.5V10.909" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMegaphoneFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.197 5.778L12.197 2.915A1 1 0 0 1 13.5 3.868L13.5 11.132A1 1 0 0 1 12.197 12.085L3.197 9.222A1 1 0 0 1 2.5 8.269L2.5 6.731A1 1 0 0 1 3.197 5.778Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.5 9.636 V 11.5 A 2 2 0 0 0 8.5 11.5 V 10.909" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMenuIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4H13.5M2.5 8H13.5M2.5 12H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMenuFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 4 H 13.313 M 2.688 8 H 13.313 M 2.688 12 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMicIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 4A2 2 0 0 1 10 4V7.5A2 2 0 0 1 6 7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 7.5A5 5 0 0 0 13 7.5M8 12.5V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMicFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6 4A2 2 0 0 1 10 4V7.5A2 2 0 0 1 6 7.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.006 7.745 A 5 5 0 0 0 12.994 7.745 M 8 12.5 V 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMicOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.237 3.055A2 2 0 0 1 10 4L10 6.818M9.142 9.142A2 2 0 0 1 6 7.5L6 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 7.5A5 5 0 0 0 11.277 11.277M8 12.5L8 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMicOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6 4A2 2 0 0 1 10 4V7.5A2 2 0 0 1 6 7.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 3.013 7.857 A 5 5 0 0 0 11.277 11.277 M 8 12.5 L 8 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.133 2.133 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMinusIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 8H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMinusFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 8 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMoonIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2A6 6 0 1 0 14 8A6 6 0 0 1 8 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMoonFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 2A6 6 0 1 0 14 8A6 6 0 0 1 8 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotMoreVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(90 8 8)">
      <circle cx="3" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="13" cy="8" r="1" fill="currentColor" />
    </g>
  </svg>
);

export const PilotMoreVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(90 8 8)">
        <circle cx="3" cy="8" r="1.1875" fill="currentColor" />
        <circle cx="8" cy="8" r="1.1875" fill="currentColor" />
        <circle cx="13" cy="8" r="1.1875" fill="currentColor" />
      </g>
    </svg>
  );
};

export const PilotMoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2V14M2 8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 4L8 2L10 4M6 12L8 14L10 12M4 6L2 8L4 10M12 6L14 8L12 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 2 V 14 M 2 8 H 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.133 3.867 L 8 2 L 9.867 3.867 M 6.133 12.133 L 8 14 L 9.867 12.133 M 3.867 6.133 L 2 8 L 3.867 9.867 M 12.133 6.133 L 14 8 L 12.133 9.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotMusicIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="10.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12V3.5L13.5 2V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMusicFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4" cy="12" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="10.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6 12 V 3.5 L 13.5 2 V 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPackageIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.894 2.447L13.447 4.724A1 1 0 0 1 14 5.618L14 10.382A1 1 0 0 1 13.447 11.276L8.894 13.553A2 2 0 0 1 7.106 13.553L2.553 11.276A1 1 0 0 1 2 10.382L2 5.618A1 1 0 0 1 2.553 4.724L7.106 2.447A2 2 0 0 1 8.894 2.447Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.149 5.092L8 8L13.851 5.092M8 8V13.764M5.3 3.35L11.3 6.35" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPackageFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 4L8 8L16 4M8 8V16M3.064 2.232L13.536 7.468" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8.894 2.447L13.447 4.724A1 1 0 0 1 14 5.618L14 10.382A1 1 0 0 1 13.447 11.276L8.894 13.553A2 2 0 0 1 7.106 13.553L2.553 11.276A1 1 0 0 1 2 10.382L2 5.618A1 1 0 0 1 2.553 4.724L7.106 2.447A2 2 0 0 1 8.894 2.447Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotPaintbrushIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 2H12A0.5 0.5 0 0 1 12.5 2.5V9A2 2 0 0 1 10.5 11H9.5V12.5A1.5 1.5 0 0 1 6.5 12.5V11H5.5A2 2 0 0 1 3.5 9V2.5A0.5 0.5 0 0 1 4 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 7.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 2V3.5M10 2V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPaintbrushFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1.5 7.5L3.5 7.5H12.5L14.5 7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M7.5 2V3.5M10 2V4.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4 2H12A0.5 0.5 0 0 1 12.5 2.5V9A2 2 0 0 1 10.5 11H9.5V12.5A1.5 1.5 0 0 1 6.5 12.5V11H5.5A2 2 0 0 1 3.5 9V2.5A0.5 0.5 0 0 1 4 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPanelLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPauseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="2" width="3" height="12" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="2" width="3" height="12" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPauseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="3.5" y="2" width="3" height="12" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="2" width="3" height="12" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPeopleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="5.5" cy="5.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 14V13.5A3 3 0 0 1 5 10.5H6A3 3 0 0 1 9 13.5V14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.845 2.878A2 2 0 0 1 12.5 4A2 2 0 0 1 9.736 5.848" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.981 9.178A3 3 0 0 1 10 9H11A3 3 0 0 1 14 12V12.5H11.154" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPeopleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5.5" cy="5.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14V13.5A3 3 0 0 1 5 10.5H6A3 3 0 0 1 9 13.5V14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.99 2.689 A 2 2 0 0 1 12.5 4 A 2 2 0 0 1 9.968 5.928" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.166 9.118 A 3 3 0 0 1 10 9 H 11 A 3 3 0 0 1 14 12 V 12.5 H 11.341" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPersonAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="5.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3.5V7.5M10 5.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12 3.688 V 7.313 M 10.188 5.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPersonRemoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="5.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 5.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonRemoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.188 5.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPhoneIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="1.5" width="9" height="13" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 12H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPhoneFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 12H9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="3.5" y="1.5" width="9" height="13" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotPlayIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.865 2.554L12.96 7.129A1 1 0 0 1 12.96 8.871L4.865 13.446A1.25 1.25 0 0 1 3 12.358L3 3.642A1.25 1.25 0 0 1 4.865 2.554Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPlayFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.865 2.554L12.96 7.129A1 1 0 0 1 12.96 8.871L4.865 13.446A1.25 1.25 0 0 1 3 12.358L3 3.642A1.25 1.25 0 0 1 4.865 2.554Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPlugIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 1.5V4.5M10.5 1.5V4.5M8 11.5V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.5H12.5V7A4.5 4.5 0 0 1 3.5 7Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPlugFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.5 4.5H12.5V7A4.5 4.5 0 0 1 3.5 7Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.5 1.688 V 4.5 M 10.5 1.688 V 4.5 M 8 11.5 V 14.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPointerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.096 3.125L12.235 6.309A0.75 0.75 0 0 1 12.24 7.704L9.398 8.841A1 1 0 0 0 8.841 9.398L7.704 12.24A0.75 0.75 0 0 1 6.309 12.235L3.125 4.096A0.75 0.75 0 0 1 4.096 3.125Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPointerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.096 3.125L12.235 6.309A0.75 0.75 0 0 1 12.24 7.704L9.398 8.841A1 1 0 0 0 8.841 9.398L7.704 12.24A0.75 0.75 0 0 1 6.309 12.235L3.125 4.096A0.75 0.75 0 0 1 4.096 3.125Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPowerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.889 4.611A5.5 5.5 0 1 1 4.111 4.611" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPowerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 12.165 4.908 A 5.5 5.5 0 1 1 3.835 4.908" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 2.188 V 7.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPrinterIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 5V2H11.5V5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 11H3.5A1.5 1.5 0 0 1 2 9.5V6.5A1.5 1.5 0 0 1 3.5 5H12.5A1.5 1.5 0 0 1 14 6.5V9.5A1.5 1.5 0 0 1 12.5 11H11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 9H11.5V14H4.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPrinterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.5 11V9H11.5V11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 11H3.5A1.5 1.5 0 0 1 2 9.5V6.5A1.5 1.5 0 0 1 3.5 5H12.5A1.5 1.5 0 0 1 14 6.5V9.5A1.5 1.5 0 0 1 12.5 11H11.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 9H11.5V14H4.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 4.5 5 V 2 H 11.5 V 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPuzzleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 5A1 1 0 0 1 5 4H7A2 2 0 0 1 11 4H13A1 1 0 0 1 14 5V7A2 2 0 0 0 14 11V13A1 1 0 0 1 13 14H11A2 2 0 0 0 7 14H5A1 1 0 0 1 4 13V11A2 2 0 0 1 4 7Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPuzzleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4 5A1 1 0 0 1 5 4H7A2 2 0 0 1 11 4H13A1 1 0 0 1 14 5V7A2 2 0 0 0 14 11V13A1 1 0 0 1 13 14H11A2 2 0 0 0 7 14H5A1 1 0 0 1 4 13V11A2 2 0 0 1 4 7Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotQuoteIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4" cy="10" r="2" fill="currentColor" />
    <path d="M2.5 10V8.5A3.5 3.5 0 0 1 6 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2" fill="currentColor" />
    <path d="M10.5 10V8.5A3.5 3.5 0 0 1 14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotQuoteFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4" cy="10" r="2.1875" fill="currentColor" />
      <path d="M 2.5 9.813 V 8.5 A 3.5 3.5 0 0 1 5.743 5.009" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.1875" fill="currentColor" />
      <path d="M 10.5 9.813 V 8.5 A 3.5 3.5 0 0 1 13.743 5.009" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotReceiptIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.5 10.5V3.5L9.5 2.5L8 4L6.5 2.5L5 4L3.5 2.5L2.5 3.5V11.5A2 2 0 0 0 4.5 13.5H12A1.5 1.5 0 0 0 13.5 12V10.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7H8M5 9.5H8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotReceiptFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M10.5 8.5L10.5 10.5V13.5L10.5 15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M5 7H8M5 9.5H8" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M10.5 10.5V3.5L9.5 2.5L8 4L6.5 2.5L5 4L3.5 2.5L2.5 3.5V11.5A2 2 0 0 0 4.5 13.5H12A1.5 1.5 0 0 0 13.5 12V10.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotRedoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M5.5 2.5L2.5 5.5L5.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 5.5H9.5A4 4 0 0 1 9.5 13.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotRedoFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M 5.367 2.633 L 2.5 5.5 L 5.367 8.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.5 5.5 H 9.5 A 4 4 0 0 1 9.5 13.5 H 6.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotRefreshIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M3 5.5A5.59 5.59 0 1 1 2.6 9.447" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 2.5V5.5H6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotRefreshFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M 3 5.5 A 5.59 5.59 0 1 1 2.746 9.91" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 3 2.688 V 5.5 H 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotRepeatIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H13M10.5 2.5L13 5L10.5 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 8.5A2.5 2.5 0 0 1 10.5 11H3M5.5 8.5L3 11L5.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRepeatFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.012 7.255 A 2.5 2.5 0 0 1 5.5 5 H 13 M 10.633 2.633 L 13 5 L 10.633 7.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.988 8.745 A 2.5 2.5 0 0 1 10.5 11 H 3 M 5.367 8.633 L 3 11 L 5.367 13.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotReturnIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M13.5 2.5V8A2.5 2.5 0 0 1 11 10.5H2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 7.5L2.5 10.5L5.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotReturnFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 13.5 2.688 V 8 A 2.5 2.5 0 0 1 11 10.5 H 2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.367 7.633 L 2.5 10.5 L 5.367 13.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotRocketIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.818 6.939L8.145 3.612A3.5 3.5 0 0 1 10.352 2.597L11.33 2.522A2 2 0 0 1 13.478 4.67L13.403 5.648A3.5 3.5 0 0 1 12.388 7.855L9.061 11.182A0.5 0.5 0 0 1 8.354 11.182L4.818 7.646A0.5 0.5 0 0 1 4.818 6.939Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10.25" cy="5.75" r="1.25" fill="currentColor" />
    <path d="M11.5 8.743L11.5 11.864A1 1 0 0 1 11.207 12.571L11.182 12.596A1 1 0 0 1 9.768 12.596L8.707 11.536M7.257 4.5L4.136 4.5A1 1 0 0 0 3.429 4.793L3.404 4.818A1 1 0 0 0 3.404 6.232L4.464 7.293" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.995 11.005L3.227 12.773M6.586 12.596L5.525 13.657M3.404 9.414L2.343 10.475" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRocketFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="10.25" cy="5.75" r="1.25" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.818 6.939L8.145 3.612A3.5 3.5 0 0 1 10.352 2.597L11.33 2.522A2 2 0 0 1 13.478 4.67L13.403 5.648A3.5 3.5 0 0 1 12.388 7.855L9.061 11.182A0.5 0.5 0 0 1 8.354 11.182L4.818 7.646A0.5 0.5 0 0 1 4.818 6.939Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 8.743L11.5 11.864A1 1 0 0 1 11.207 12.571L11.182 12.596A1 1 0 0 1 9.768 12.596L8.707 11.536M7.257 4.5L4.136 4.5A1 1 0 0 0 3.429 4.793L3.404 4.818A1 1 0 0 0 3.404 6.232L4.464 7.293" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 4.862 11.138 L 3.36 12.64 M 6.453 12.729 L 5.658 13.524 M 3.271 9.547 L 2.476 10.342" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotRotateIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.707 6.707L9.793 7.793A1 1 0 0 1 9.793 9.207L8.707 10.293A1 1 0 0 1 7.293 10.293L6.207 9.207A1 1 0 0 1 6.207 7.793L7.293 6.707A1 1 0 0 1 8.707 6.707Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.665 11.08A5.59 5.59 0 1 1 13 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 3.25V5.5H10.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRotateFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8.707 6.707L9.793 7.793A1 1 0 0 1 9.793 9.207L8.707 10.293A1 1 0 0 1 7.293 10.293L6.207 9.207A1 1 0 0 1 6.207 7.793L7.293 6.707A1 1 0 0 1 8.707 6.707Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.398 11.451 A 5.59 5.59 0 1 1 13 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13 3.438 V 5.5 H 10.938" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotRulerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="4.5" y="2" width="7" height="12" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 5H7.5M4.5 8H6.5M4.5 11H7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRulerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.5 5H7.5M4.5 8H6.5M4.5 11H7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="4.5" y="2" width="7" height="12" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSaveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 2L10.586 2A1 1 0 0 1 11.293 2.293L13.707 4.707A1 1 0 0 1 14 5.414L14 12A2 2 0 0 1 12 14L4 14A2 2 0 0 1 2 12L2 4A2 2 0 0 1 4 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 2V4.5A1 1 0 0 0 6 5.5H9A1 1 0 0 0 10 4.5V2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 14V9.5A1 1 0 0 1 5.5 8.5H10.5A1 1 0 0 1 11.5 9.5V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSaveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 2V4.5A1 1 0 0 0 6 5.5H9A1 1 0 0 0 10 4.5V2" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 14V9.5A1 1 0 0 1 5.5 8.5H10.5A1 1 0 0 1 11.5 9.5V14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4 2L10.586 2A1 1 0 0 1 11.293 2.293L13.707 4.707A1 1 0 0 1 14 5.414L14 12A2 2 0 0 1 12 14L4 14A2 2 0 0 1 2 12L2 4A2 2 0 0 1 4 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotScissorsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.414 5.414L13.5 13.5M5.414 10.586L13.5 2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotScissorsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.414 5.414 L 13.367 13.367 M 5.414 10.586 L 13.367 2.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotSendIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M12.794 8.887L4.343 13.282A1 1 0 0 1 2.948 12.036L4.224 8.718A2 2 0 0 0 4.224 7.282L2.948 3.964A1 1 0 0 1 4.343 2.718L12.794 7.113A1 1 0 0 1 12.794 8.887Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSendFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M12.794 8.887L4.343 13.282A1 1 0 0 1 2.948 12.036L4.224 8.718A2 2 0 0 0 4.224 7.282L2.948 3.964A1 1 0 0 1 4.343 2.718L12.794 7.113A1 1 0 0 1 12.794 8.887Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotServerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="1.5" width="12" height="5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="9.5" width="12" height="5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="4" r="0.75" fill="currentColor" />
    <circle cx="5" cy="12" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotServerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="5" cy="4" r="0.75" fill="black" />
        <circle cx="5" cy="12" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="1.5" width="12" height="5" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="9.5" width="12" height="5" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotShareIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 10V2M5 5L8 2L11 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7.5A1.5 1.5 0 0 0 3.5 9V12A1.5 1.5 0 0 0 5 13.5H11A1.5 1.5 0 0 0 12.5 12V9A1.5 1.5 0 0 0 11 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShareFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 9.813 V 2 M 5.133 4.867 L 8 2 L 10.867 4.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.78 7.516 A 1.5 1.5 0 0 0 3.5 9 V 12 A 1.5 1.5 0 0 0 5 13.5 H 11 A 1.5 1.5 0 0 0 12.5 12 V 9 A 1.5 1.5 0 0 0 11.22 7.516" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotShieldIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M13.5 8.5C13.5 11.8 10.97 13.5 8.22 14.4A0.6 0.6 0 0 1 7.78 14.4C5.03 13.5 2.5 11.8 2.5 8.5V4.2A0.7 0.7 0 0 1 3.27 3.5C4.7 3.5 6.46 2.7 7.56 1.8A0.6 0.6 0 0 1 8.44 1.8C9.54 2.7 11.3 3.5 12.73 3.5A0.7 0.7 0 0 1 13.5 4.2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShieldFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M13.5 8.5C13.5 11.8 10.97 13.5 8.22 14.4A0.6 0.6 0 0 1 7.78 14.4C5.03 13.5 2.5 11.8 2.5 8.5V4.2A0.7 0.7 0 0 1 3.27 3.5C4.7 3.5 6.46 2.7 7.56 1.8A0.6 0.6 0 0 1 8.44 1.8C9.54 2.7 11.3 3.5 12.73 3.5A0.7 0.7 0 0 1 13.5 4.2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotShoppingBagIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.74 2L11.26 2A0.5 0.5 0 0 1 11.65 2.188L13.39 4.363A0.5 0.5 0 0 1 13.5 4.675L13.5 11.5A2 2 0 0 1 11.5 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 4.675A0.5 0.5 0 0 1 2.61 4.363L4.35 2.188A0.5 0.5 0 0 1 4.74 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 4.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 7A2.5 2.5 0 0 1 5.5 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShoppingBagFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 4.5L2.5 4.5H13.5L15.5 4.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M10.5 7A2.5 2.5 0 0 1 5.5 7" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.74 2L11.26 2A0.5 0.5 0 0 1 11.65 2.188L13.39 4.363A0.5 0.5 0 0 1 13.5 4.675L13.5 11.5A2 2 0 0 1 11.5 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 4.675A0.5 0.5 0 0 1 2.61 4.363L4.35 2.188A0.5 0.5 0 0 1 4.74 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSkipBackIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M4.402 3.662L10.104 7.147A1 1 0 0 1 10.104 8.853L4.402 12.338A1.25 1.25 0 0 1 2.5 11.271L2.5 4.729A1.25 1.25 0 0 1 4.402 3.662Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotSkipBackFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M4.402 3.662L10.104 7.147A1 1 0 0 1 10.104 8.853L4.402 12.338A1.25 1.25 0 0 1 2.5 11.271L2.5 4.729A1.25 1.25 0 0 1 4.402 3.662Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 13.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSkipForwardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.402 3.662L10.104 7.147A1 1 0 0 1 10.104 8.853L4.402 12.338A1.25 1.25 0 0 1 2.5 11.271L2.5 4.729A1.25 1.25 0 0 1 4.402 3.662Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSkipForwardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.402 3.662L10.104 7.147A1 1 0 0 1 10.104 8.853L4.402 12.338A1.25 1.25 0 0 1 2.5 11.271L2.5 4.729A1.25 1.25 0 0 1 4.402 3.662Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotSmileIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
    <path d="M5.5 9.5A3 3 0 0 0 10.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSmileFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6" cy="6" r="1" fill="black" />
        <circle cx="10" cy="6" r="1" fill="black" />
        <path d="M5.5 9.5A3 3 0 0 0 10.5 9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M8 1.75Q8.75 7.25 14.25 8Q8.75 8.75 8 14.25Q7.25 8.75 1.75 8Q7.25 7.25 8 1.75Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSparkleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 1.75Q8.75 7.25 14.25 8Q8.75 8.75 8 14.25Q7.25 8.75 1.75 8Q7.25 7.25 8 1.75Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M8.673 2.805L10.073 5.642A0.25 0.25 0 0 0 10.261 5.779L13.391 6.233A0.75 0.75 0 0 1 13.807 7.513L11.542 9.721A0.25 0.25 0 0 0 11.47 9.942L12.005 13.06A0.75 0.75 0 0 1 10.916 13.851L8.116 12.378A0.25 0.25 0 0 0 7.884 12.378L5.084 13.851A0.75 0.75 0 0 1 3.995 13.06L4.53 9.942A0.25 0.25 0 0 0 4.458 9.721L2.193 7.513A0.75 0.75 0 0 1 2.609 6.233L5.739 5.779A0.25 0.25 0 0 0 5.927 5.642L7.327 2.805A0.75 0.75 0 0 1 8.673 2.805Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStarFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8.673 2.805L10.073 5.642A0.25 0.25 0 0 0 10.261 5.779L13.391 6.233A0.75 0.75 0 0 1 13.807 7.513L11.542 9.721A0.25 0.25 0 0 0 11.47 9.942L12.005 13.06A0.75 0.75 0 0 1 10.916 13.851L8.116 12.378A0.25 0.25 0 0 0 7.884 12.378L5.084 13.851A0.75 0.75 0 0 1 3.995 13.06L4.53 9.942A0.25 0.25 0 0 0 4.458 9.721L2.193 7.513A0.75 0.75 0 0 1 2.609 6.233L5.739 5.779A0.25 0.25 0 0 0 5.927 5.642L7.327 2.805A0.75 0.75 0 0 1 8.673 2.805Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStatusAvailableIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotStickyNoteIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 8.793A0.5 0.5 0 0 1 13.354 9.146L9.146 13.354A0.5 0.5 0 0 1 8.793 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 9H10.5A1.5 1.5 0 0 0 9 10.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStickyNoteFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M15.5 9L13.5 9H10.5A1.5 1.5 0 0 0 9 10.5V13.5L9 15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 8.793A0.5 0.5 0 0 1 13.354 9.146L9.146 13.354A0.5 0.5 0 0 1 8.793 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 4.5A2 2 0 0 1 4.5 2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotStopIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStopFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStrikethroughIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.031 3.875A3.5 2.75 0 1 0 8 8A3.5 2.75 0 1 1 4.969 12.125" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStrikethroughFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 10.91 3.722 A 3.5 2.75 0 1 0 8 8 A 3.5 2.75 0 1 1 5.09 12.278" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.188 8 H 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSunIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V3M8 13V14M2 8H3M13 8H14M3.757 3.757L4.464 4.464M12.243 12.243L11.536 11.536M12.243 3.757L11.536 4.464M3.757 12.243L4.464 11.536" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSunFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="8" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 2.188 V 2.813 M 8 13.188 V 13.813 M 2.188 8 H 2.813 M 13.188 8 H 13.813 M 3.89 3.89 L 4.331 4.331 M 12.11 12.11 L 11.669 11.669 M 12.11 3.89 L 11.669 4.331 M 3.89 12.11 L 4.331 11.669" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTableIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6H13.5M2.5 10H13.5M6.5 6V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTableFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M2.5 6H13.5M2.5 10H13.5M6.5 6V13.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTagIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5L7.086 2.5A1 1 0 0 1 7.793 2.793L12.939 7.939A1.5 1.5 0 0 1 12.939 10.061L9.707 13.293A1 1 0 0 1 8.293 13.293L2.793 7.793A1 1 0 0 1 2.5 7.086L2.5 4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
  </svg>
);

export const PilotTagFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6" cy="6" r="1" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 2.5L7.086 2.5A1 1 0 0 1 7.793 2.793L12.939 7.939A1.5 1.5 0 0 1 12.939 10.061L9.707 13.293A1 1 0 0 1 8.293 13.293L2.793 7.793A1 1 0 0 1 2.5 7.086L2.5 4.5A2 2 0 0 1 4.5 2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTerminalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 6L7 8L5 10M8.5 10H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTerminalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 6L7 8L5 10M8.5 10H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTextIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4.5V2.5H13.5V4.5M8 2.5V13.5M5.5 13.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 4.313 V 2.5 H 13.5 V 4.313 M 8 2.5 V 13.5 M 5.688 13.5 H 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotThumbsDownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(1 0 0 -1 0 16)">
      <path d="M9.8 4.4L9.2 7H12.7A1.2 1.2 0 0 1 13.85 8.54L12.45 13.14A1.2 1.2 0 0 1 11.3 14H3.2A1.2 1.2 0 0 1 2 12.8V8.2A1.2 1.2 0 0 1 3.2 7H4.86A1.2 1.2 0 0 0 5.93 6.34L8 2A1.9 1.9 0 0 1 9.8 4.4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotThumbsDownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(1 0 0 -1 0 16)">
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
          <rect width="16" height="16" fill="white" />
          <path d="M5 5L5 7V14L5 16" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        </mask>
        <g mask={`url(#${id})`}>
          <path d="M9.8 4.4L9.2 7H12.7A1.2 1.2 0 0 1 13.85 8.54L12.45 13.14A1.2 1.2 0 0 1 11.3 14H3.2A1.2 1.2 0 0 1 2 12.8V8.2A1.2 1.2 0 0 1 3.2 7H4.86A1.2 1.2 0 0 0 5.93 6.34L8 2A1.9 1.9 0 0 1 9.8 4.4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

export const PilotThumbsUpIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M9.8 4.4L9.2 7H12.7A1.2 1.2 0 0 1 13.85 8.54L12.45 13.14A1.2 1.2 0 0 1 11.3 14H3.2A1.2 1.2 0 0 1 2 12.8V8.2A1.2 1.2 0 0 1 3.2 7H4.86A1.2 1.2 0 0 0 5.93 6.34L8 2A1.9 1.9 0 0 1 9.8 4.4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotThumbsUpFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 5L5 7V14L5 16" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M9.8 4.4L9.2 7H12.7A1.2 1.2 0 0 1 13.85 8.54L12.45 13.14A1.2 1.2 0 0 1 11.3 14H3.2A1.2 1.2 0 0 1 2 12.8V8.2A1.2 1.2 0 0 1 3.2 7H4.86A1.2 1.2 0 0 0 5.93 6.34L8 2A1.9 1.9 0 0 1 9.8 4.4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTokenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTokenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="3" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotTrendingUpIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 11L6 7L9 10L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 5H14V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTrendingUpFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.133 10.867 L 6 7 L 9 10 L 14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.188 5 H 14 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTrophyIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 3.5A1.5 1.5 0 0 1 6.5 2H9.5A1.5 1.5 0 0 1 11 3.5V5.5A3 3 0 0 1 5 5.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 3.5H3A1 1 0 0 0 2 4.5V5A2 2 0 0 0 4 7H5.402M11 3.5H13A1 1 0 0 1 14 4.5V5A2 2 0 0 1 12 7H10.598" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8.5V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 14V13A2 2 0 0 1 7 11H9A2 2 0 0 1 11 13V14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTrophyFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 3.5A1.5 1.5 0 0 1 6.5 2H9.5A1.5 1.5 0 0 1 11 3.5V5.5A3 3 0 0 1 5 5.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14V13A2 2 0 0 1 7 11H9A2 2 0 0 1 11 13V14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5 3.5 H 3 A 1 1 0 0 0 2 4.5 V 5 A 2 2 0 0 0 4 7 H 5.402 M 11 3.5 H 13 A 1 1 0 0 1 14 4.5 V 5 A 2 2 0 0 1 12 7 H 10.598" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 8.5 V 11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUnderlineIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5V7.5A3.5 3.5 0 0 0 11.5 7.5V2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 13.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUnderlineFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.5 2.688 V 7.5 A 3.5 3.5 0 0 0 11.5 7.5 V 2.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.688 13.5 H 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUndoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5L2.5 5.5L5.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5.5H9.5A4 4 0 0 1 9.5 13.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUndoFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.367 2.633 L 2.5 5.5 L 5.367 8.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 5.5 H 9.5 A 4 4 0 0 1 9.5 13.5 H 6.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUnlockIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="7.5" width="9" height="6" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7.5V5.5A3 3 0 0 1 10.719 4.232" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 10V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUnlockFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
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
      <path d="M 5 7.5 V 5.5 A 3 3 0 0 1 10.602 4.007" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotVideoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="4" width="9" height="8" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 7L14 5V11L10.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotVideoFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="1.5" y="4" width="9" height="8" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 7L14 5V11L10.5 9Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotVideoOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M10.449 10.449A2 2 0 0 1 8.5 12L4 12A2 2 0 0 1 2 10L2 6A2 2 0 0 1 4 4M7.182 4L8.5 4A2 2 0 0 1 10.5 6L10.5 7.318" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 7.318L10.5 7L14 5L14 10.818" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotVideoOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4 4H8.5A2 2 0 0 1 10.5 6V10A2 2 0 0 1 8.5 12H4A2 2 0 0 1 2 10V6A2 2 0 0 1 4 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 7L14 5V11L10.5 9Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M 2.133 2.133 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotVolumeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 6L4.315 6A0.5 0.5 0 0 0 4.64 5.88L6.762 4.061A0.75 0.75 0 0 1 8 4.631L8 11.369A0.75 0.75 0 0 1 6.762 11.939L4.64 10.12A0.5 0.5 0 0 0 4.315 10L3 10A1 1 0 0 1 2 9L2 7A1 1 0 0 1 3 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 5.5A3.5 3.5 0 0 1 10.5 10.5M12 3.5A6.364 6.364 0 0 1 12 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotVolumeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3 6L4.315 6A0.5 0.5 0 0 0 4.64 5.88L6.762 4.061A0.75 0.75 0 0 1 8 4.631L8 11.369A0.75 0.75 0 0 1 6.762 11.939L4.64 10.12A0.5 0.5 0 0 0 4.315 10L3 10A1 1 0 0 1 2 9L2 7A1 1 0 0 1 3 6Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.679 5.689 A 3.5 3.5 0 0 1 10.679 10.311 M 12.215 3.726 A 6.364 6.364 0 0 1 12.215 12.274" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotVolumeOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 6L4.315 6A0.5 0.5 0 0 0 4.64 5.88L6.762 4.061A0.75 0.75 0 0 1 8 4.631L8 11.369A0.75 0.75 0 0 1 6.762 11.939L4.64 10.12A0.5 0.5 0 0 0 4.315 10L3 10A1 1 0 0 1 2 9L2 7A1 1 0 0 1 3 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 6.25L14 9.75M14 6.25L10.5 9.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotVolumeOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3 6L4.315 6A0.5 0.5 0 0 0 4.64 5.88L6.762 4.061A0.75 0.75 0 0 1 8 4.631L8 11.369A0.75 0.75 0 0 1 6.762 11.939L4.64 10.12A0.5 0.5 0 0 0 4.315 10L3 10A1 1 0 0 1 2 9L2 7A1 1 0 0 1 3 6Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.633 6.383 L 13.867 9.617 M 13.867 6.383 L 10.633 9.617" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotWalletIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 4.5V11A2 2 0 0 0 4 13H12.5A1.5 1.5 0 0 0 14 11.5V7.5A1.5 1.5 0 0 0 12.5 6H3.5A1.5 1.5 0 0 1 2 4.5A1.5 1.5 0 0 1 3.5 3H11A1.5 1.5 0 0 1 12.5 4.5V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 9.5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWalletFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M10.5 9.5H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 6H12.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 4.5V11A2 2 0 0 0 4 13H12.5A1.5 1.5 0 0 0 14 11.5V7.5A1.5 1.5 0 0 0 12.5 6H3.5A1.5 1.5 0 0 1 2 4.5A1.5 1.5 0 0 1 3.5 3H11A1.5 1.5 0 0 1 12.5 4.5V6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotWifiIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.613 9.94A3.5 3.5 0 0 1 10.387 9.94M3.567 7.746A6.5 6.5 0 0 1 12.433 7.746M1.521 5.552A9.5 9.5 0 0 1 14.479 5.552" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="12.5" r="1" fill="currentColor" />
  </svg>
);

export const PilotWifiFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.799 9.779 A 3.5 3.5 0 0 1 10.201 9.779 M 3.795 7.543 A 6.5 6.5 0 0 1 12.205 7.543 M 1.686 5.402 A 9.5 9.5 0 0 1 14.314 5.402" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="12.5" r="1.1875" fill="currentColor" />
    </svg>
  );
};

export const PilotWifiOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.613 9.94A3.5 3.5 0 0 1 9.219 9.219M3.567 7.746A6.5 6.5 0 0 1 6.242 6.242M9.316 6.135A6.5 6.5 0 0 1 12.433 7.746M1.521 5.552A9.5 9.5 0 0 1 3.92 3.92M6.33 3.148A9.5 9.5 0 0 1 14.479 5.552" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="12.5" r="1" fill="currentColor" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWifiOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="12.5" r="1.1875" fill="currentColor" />
      <path d="M 2.133 2.133 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.613 9.94A3.5 3.5 0 0 1 9.219 9.219M3.567 7.746A6.5 6.5 0 0 1 6.242 6.242M9.785 6.25A6.5 6.5 0 0 1 12.433 7.746M1.521 5.552A9.5 9.5 0 0 1 3.92 3.92M6.634 3.099A9.5 9.5 0 0 1 14.479 5.552" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotZoomInIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 5V9M5 7H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotZoomInFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.5 10.5 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7 5.188 V 8.813 M 5.188 7 H 8.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotZoomOutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 7H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotZoomOutFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.5 10.5 L 13.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.188 7 H 8.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = [{"id":"batch-1","title":"Batch 1 · Core","icons":{"add":"approved","arrow-up":"approved","bell":"approved","check":"approved","chevron-down":"approved","copy":"approved","dismiss":"approved","document":"approved","eye":"approved","folder":"approved","info":"approved","link":"approved","more-horizontal":"approved","open":"approved","person":"approved","reset":"approved","search":"approved","settings":"approved","status-available":"approved","trash":"approved","warning":"approved"}},{"id":"batch-2","title":"Batch 2 · Alignment","icons":{"align-left":"approved","align-center":"approved"}},{"id":"batch-3","title":"Batch 3 · Docs chrome","icons":{"expand":"approved","panel-left":"approved","book":"approved","options":"approved","color":"approved","text":"approved","shapes":"approved","list":"approved","square-dashed":"approved","layers":"approved","flash":"approved"}},{"id":"batch-4","title":"Batch 4 · Inspector","icons":{"angle":"approved","aspect-ratio":"approved","auto-layout":"approved","corner":"approved","corners":"approved","dots-four":"approved","eye-off":"approved","flip":"approved","flow":"approved","flow-wrap":"approved","flow-free":"approved","gap":"approved","opacity":"approved","padding":"approved","padding-sides":"approved","token":"approved","rotate":"approved"}},{"id":"batch-5","title":"Batch 5 · Common","icons":{"lock":"approved","star":"approved","heart":"approved","calendar":"approved","clock":"approved","pencil":"approved","download":"approved","upload":"approved","filter":"approved","sort":"approved","sparkle":"approved","pin":"approved"}},{"id":"batch-6","title":"Batch 6 · Everyday","icons":{"minus":"approved","send":"approved","home":"approved","mail":"approved","chat":"approved","image":"approved","mic":"approved","help":"approved","bookmark":"approved"}},{"id":"batch-7","title":"Batch 7 · Controls & system","icons":{"menu":"approved","grid":"approved","play":"approved","pause":"approved","undo":"approved","sun":"approved","moon":"approved","desktop":"approved","code":"approved","terminal":"approved","error":"approved","unlock":"approved","share":"approved","globe":"approved"}},{"id":"batch-8","title":"Batch 8 · Objects","icons":{"attach":"approved","tag":"approved","people":"approved","zoom-in":"approved","zoom-out":"approved","flag":"approved","archive":"approved","cloud":"approved","phone":"approved","camera":"approved","cart":"approved"}},{"id":"batch-9","title":"Batch 9 · Text & objects","icons":{"bold":"approved","italic":"approved","underline":"approved","quote":"approved","hash":"approved","at":"approved","key":"approved","shield":"approved","gift":"approved","map":"approved","chart":"approved","table":"approved"}},{"id":"batch-10","title":"Batch 10 · Editing & devices","icons":{"strikethrough":"approved","heading":"approved","list-bullet":"approved","wifi":"approved","bluetooth":"approved","battery":"approved","plug":"approved","power":"approved","printer":"approved","headphones":"approved","video":"approved","inbox":"approved"}},{"id":"batch-11","title":"Batch 11 · Everyday objects","icons":{"thumbs-up":"approved","smile":"approved","briefcase":"approved","building":"approved","compass":"approved","crop":"approved","trophy":"approved","coffee":"approved"}},{"id":"batch-12","title":"Batch 12 · System & tools","icons":{"database":"approved","server":"approved","scissors":"approved","log-in":"approved","log-out":"approved","keyboard":"approved","pointer":"approved","move":"review","hourglass":"approved","loader":"approved"}},{"id":"batch-13","title":"Batch 13 · Media & commerce","icons":{"volume":"approved","volume-off":"approved","music":"approved","film":"approved","credit-card":"approved","wallet":"approved","receipt":"approved","lightbulb":"approved","megaphone":"approved"}},{"id":"batch-14","title":"Batch 14 · Tools & actions","icons":{"person-add":"review","history":"approved","save":"approved","bug":"review","eyedropper":"approved","paintbrush":"review","puzzle":"review","ruler":"approved"}},{"id":"batch-15","title":"Batch 15 · Off states & objects","icons":{"bell-off":"review","mic-off":"review","video-off":"review","calculator":"review","graduation-cap":"approved","car":"review","package":"review"}},{"id":"batch-16","title":"Batch 16 · Keys & connections","icons":{"wifi-off":"review","link-off":"review","cloud-upload":"review","command":"review","return":"review","backspace":"review","rocket":"review"}},{"id":"batch-17","title":"Batch 17 · Media & everyday","icons":{"skip-forward":"review","stop":"review","repeat":"review","person-remove":"review","clipboard":"review","sticky-note":"review","trending-up":"review","shopping-bag":"review"}}] as const;

export const PILOT_ICONS = [
  { name: "add", keyline: "square", derivedFrom: undefined, Icon: PilotAddIcon, Filled: PilotAddFilledIcon, fill: "weight" },
  { name: "align-bottom", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignBottomIcon, Filled: PilotAlignBottomFilledIcon, fill: "solid" },
  { name: "align-center", keyline: "square", derivedFrom: undefined, Icon: PilotAlignCenterIcon, Filled: PilotAlignCenterFilledIcon, fill: "solid" },
  { name: "align-left", keyline: "square", derivedFrom: undefined, Icon: PilotAlignLeftIcon, Filled: PilotAlignLeftFilledIcon, fill: "solid" },
  { name: "align-middle", keyline: "square", derivedFrom: "align-center", Icon: PilotAlignMiddleIcon, Filled: PilotAlignMiddleFilledIcon, fill: "solid" },
  { name: "align-right", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignRightIcon, Filled: PilotAlignRightFilledIcon, fill: "solid" },
  { name: "align-top", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignTopIcon, Filled: PilotAlignTopFilledIcon, fill: "solid" },
  { name: "angle", keyline: "square", derivedFrom: undefined, Icon: PilotAngleIcon, Filled: PilotAngleFilledIcon, fill: "weight" },
  { name: "archive", keyline: "horizontal", derivedFrom: undefined, Icon: PilotArchiveIcon, Filled: PilotArchiveFilledIcon, fill: "solid" },
  { name: "arrow-down", keyline: "vertical", derivedFrom: "arrow-up", Icon: PilotArrowDownIcon, Filled: PilotArrowDownFilledIcon, fill: "weight" },
  { name: "arrow-left", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowLeftIcon, Filled: PilotArrowLeftFilledIcon, fill: "weight" },
  { name: "arrow-right", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowRightIcon, Filled: PilotArrowRightFilledIcon, fill: "weight" },
  { name: "arrow-up", keyline: "vertical", derivedFrom: undefined, Icon: PilotArrowUpIcon, Filled: PilotArrowUpFilledIcon, fill: "weight" },
  { name: "aspect-ratio", keyline: "square", derivedFrom: undefined, Icon: PilotAspectRatioIcon, Filled: PilotAspectRatioFilledIcon, fill: "solid" },
  { name: "at", keyline: "circle", derivedFrom: undefined, Icon: PilotAtIcon, Filled: PilotAtFilledIcon, fill: "weight" },
  { name: "attach", keyline: "circle", derivedFrom: undefined, Icon: PilotAttachIcon, Filled: PilotAttachFilledIcon, fill: "weight" },
  { name: "auto-layout", keyline: "square", derivedFrom: undefined, Icon: PilotAutoLayoutIcon, Filled: PilotAutoLayoutFilledIcon, fill: "solid" },
  { name: "backspace", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBackspaceIcon, Filled: PilotBackspaceFilledIcon, fill: "solid" },
  { name: "battery", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBatteryIcon, Filled: PilotBatteryFilledIcon, fill: "solid" },
  { name: "bell", keyline: "square", derivedFrom: undefined, Icon: PilotBellIcon, Filled: PilotBellFilledIcon, fill: "solid" },
  { name: "bell-off", keyline: "square", derivedFrom: undefined, Icon: PilotBellOffIcon, Filled: PilotBellOffFilledIcon, fill: "solid" },
  { name: "bluetooth", keyline: "vertical", derivedFrom: undefined, Icon: PilotBluetoothIcon, Filled: PilotBluetoothFilledIcon, fill: "weight" },
  { name: "bold", keyline: "vertical", derivedFrom: undefined, Icon: PilotBoldIcon, Filled: PilotBoldFilledIcon, fill: "weight" },
  { name: "book", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBookIcon, Filled: PilotBookFilledIcon, fill: "solid" },
  { name: "bookmark", keyline: "vertical", derivedFrom: undefined, Icon: PilotBookmarkIcon, Filled: PilotBookmarkFilledIcon, fill: "solid" },
  { name: "briefcase", keyline: "square", derivedFrom: undefined, Icon: PilotBriefcaseIcon, Filled: PilotBriefcaseFilledIcon, fill: "solid" },
  { name: "bug", keyline: "square", derivedFrom: undefined, Icon: PilotBugIcon, Filled: PilotBugFilledIcon, fill: "solid" },
  { name: "building", keyline: "vertical", derivedFrom: undefined, Icon: PilotBuildingIcon, Filled: PilotBuildingFilledIcon, fill: "solid" },
  { name: "calculator", keyline: "square", derivedFrom: undefined, Icon: PilotCalculatorIcon, Filled: PilotCalculatorFilledIcon, fill: "solid" },
  { name: "calendar", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarIcon, Filled: PilotCalendarFilledIcon, fill: "solid" },
  { name: "camera", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCameraIcon, Filled: PilotCameraFilledIcon, fill: "solid" },
  { name: "car", keyline: "square", derivedFrom: undefined, Icon: PilotCarIcon, Filled: PilotCarFilledIcon, fill: "solid" },
  { name: "cart", keyline: "square", derivedFrom: undefined, Icon: PilotCartIcon, Filled: PilotCartFilledIcon, fill: "weight" },
  { name: "chart", keyline: "square", derivedFrom: undefined, Icon: PilotChartIcon, Filled: PilotChartFilledIcon, fill: "weight" },
  { name: "chat", keyline: "square", derivedFrom: undefined, Icon: PilotChatIcon, Filled: PilotChatFilledIcon, fill: "solid" },
  { name: "check", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCheckIcon, Filled: PilotCheckFilledIcon, fill: "weight" },
  { name: "chevron-down", keyline: "horizontal", derivedFrom: undefined, Icon: PilotChevronDownIcon, Filled: PilotChevronDownFilledIcon, fill: "weight" },
  { name: "chevron-left", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronLeftIcon, Filled: PilotChevronLeftFilledIcon, fill: "weight" },
  { name: "chevron-right", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronRightIcon, Filled: PilotChevronRightFilledIcon, fill: "weight" },
  { name: "chevron-up", keyline: "horizontal", derivedFrom: "chevron-down", Icon: PilotChevronUpIcon, Filled: PilotChevronUpFilledIcon, fill: "weight" },
  { name: "clipboard", keyline: "vertical", derivedFrom: undefined, Icon: PilotClipboardIcon, Filled: PilotClipboardFilledIcon, fill: "solid" },
  { name: "clock", keyline: "circle", derivedFrom: undefined, Icon: PilotClockIcon, Filled: PilotClockFilledIcon, fill: "solid" },
  { name: "cloud", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCloudIcon, Filled: PilotCloudFilledIcon, fill: "solid" },
  { name: "cloud-upload", keyline: "square", derivedFrom: undefined, Icon: PilotCloudUploadIcon, Filled: PilotCloudUploadFilledIcon, fill: "solid" },
  { name: "code", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCodeIcon, Filled: PilotCodeFilledIcon, fill: "weight" },
  { name: "coffee", keyline: "square", derivedFrom: undefined, Icon: PilotCoffeeIcon, Filled: PilotCoffeeFilledIcon, fill: "solid" },
  { name: "color", keyline: "vertical", derivedFrom: undefined, Icon: PilotColorIcon, Filled: PilotColorFilledIcon, fill: "solid" },
  { name: "command", keyline: "square", derivedFrom: undefined, Icon: PilotCommandIcon, Filled: PilotCommandFilledIcon, fill: "weight" },
  { name: "compass", keyline: "circle", derivedFrom: undefined, Icon: PilotCompassIcon, Filled: PilotCompassFilledIcon, fill: "solid" },
  { name: "copy", keyline: "square", derivedFrom: undefined, Icon: PilotCopyIcon, Filled: PilotCopyFilledIcon, fill: "solid" },
  { name: "corner", keyline: "square", derivedFrom: undefined, Icon: PilotCornerIcon, Filled: PilotCornerFilledIcon, fill: "weight" },
  { name: "corner-bottom-left", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomLeftIcon, Filled: PilotCornerBottomLeftFilledIcon, fill: "weight" },
  { name: "corner-bottom-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomRightIcon, Filled: PilotCornerBottomRightFilledIcon, fill: "weight" },
  { name: "corner-top-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerTopRightIcon, Filled: PilotCornerTopRightFilledIcon, fill: "weight" },
  { name: "corners", keyline: "square", derivedFrom: undefined, Icon: PilotCornersIcon, Filled: PilotCornersFilledIcon, fill: "weight" },
  { name: "credit-card", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCreditCardIcon, Filled: PilotCreditCardFilledIcon, fill: "solid" },
  { name: "crop", keyline: "square", derivedFrom: undefined, Icon: PilotCropIcon, Filled: PilotCropFilledIcon, fill: "weight" },
  { name: "database", keyline: "square", derivedFrom: undefined, Icon: PilotDatabaseIcon, Filled: PilotDatabaseFilledIcon, fill: "solid" },
  { name: "desktop", keyline: "square", derivedFrom: undefined, Icon: PilotDesktopIcon, Filled: PilotDesktopFilledIcon, fill: "solid" },
  { name: "dismiss", keyline: "circle", derivedFrom: undefined, Icon: PilotDismissIcon, Filled: PilotDismissFilledIcon, fill: "weight" },
  { name: "document", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentIcon, Filled: PilotDocumentFilledIcon, fill: "solid" },
  { name: "dots-four", keyline: "square", derivedFrom: undefined, Icon: PilotDotsFourIcon, Filled: PilotDotsFourFilledIcon, fill: "solid" },
  { name: "download", keyline: "square", derivedFrom: undefined, Icon: PilotDownloadIcon, Filled: PilotDownloadFilledIcon, fill: "weight" },
  { name: "error", keyline: "circle", derivedFrom: undefined, Icon: PilotErrorIcon, Filled: PilotErrorFilledIcon, fill: "solid" },
  { name: "expand", keyline: "square", derivedFrom: undefined, Icon: PilotExpandIcon, Filled: PilotExpandFilledIcon, fill: "weight" },
  { name: "eye", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeIcon, Filled: PilotEyeFilledIcon, fill: "solid" },
  { name: "eye-off", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeOffIcon, Filled: PilotEyeOffFilledIcon, fill: "weight" },
  { name: "eyedropper", keyline: "square", derivedFrom: undefined, Icon: PilotEyedropperIcon, Filled: PilotEyedropperFilledIcon, fill: "solid" },
  { name: "film", keyline: "square", derivedFrom: undefined, Icon: PilotFilmIcon, Filled: PilotFilmFilledIcon, fill: "solid" },
  { name: "filter", keyline: "square", derivedFrom: undefined, Icon: PilotFilterIcon, Filled: PilotFilterFilledIcon, fill: "solid" },
  { name: "flag", keyline: "square", derivedFrom: undefined, Icon: PilotFlagIcon, Filled: PilotFlagFilledIcon, fill: "solid" },
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
  { name: "gift", keyline: "square", derivedFrom: undefined, Icon: PilotGiftIcon, Filled: PilotGiftFilledIcon, fill: "solid" },
  { name: "globe", keyline: "circle", derivedFrom: undefined, Icon: PilotGlobeIcon, Filled: PilotGlobeFilledIcon, fill: "solid" },
  { name: "graduation-cap", keyline: "horizontal", derivedFrom: undefined, Icon: PilotGraduationCapIcon, Filled: PilotGraduationCapFilledIcon, fill: "solid" },
  { name: "grid", keyline: "square", derivedFrom: undefined, Icon: PilotGridIcon, Filled: PilotGridFilledIcon, fill: "solid" },
  { name: "hash", keyline: "square", derivedFrom: undefined, Icon: PilotHashIcon, Filled: PilotHashFilledIcon, fill: "weight" },
  { name: "heading", keyline: "square", derivedFrom: undefined, Icon: PilotHeadingIcon, Filled: PilotHeadingFilledIcon, fill: "weight" },
  { name: "headphones", keyline: "circle", derivedFrom: undefined, Icon: PilotHeadphonesIcon, Filled: PilotHeadphonesFilledIcon, fill: "solid" },
  { name: "heart", keyline: "circle", derivedFrom: undefined, Icon: PilotHeartIcon, Filled: PilotHeartFilledIcon, fill: "solid" },
  { name: "help", keyline: "circle", derivedFrom: undefined, Icon: PilotHelpIcon, Filled: PilotHelpFilledIcon, fill: "solid" },
  { name: "history", keyline: "circle", derivedFrom: undefined, Icon: PilotHistoryIcon, Filled: PilotHistoryFilledIcon, fill: "weight" },
  { name: "home", keyline: "square", derivedFrom: undefined, Icon: PilotHomeIcon, Filled: PilotHomeFilledIcon, fill: "solid" },
  { name: "hourglass", keyline: "vertical", derivedFrom: undefined, Icon: PilotHourglassIcon, Filled: PilotHourglassFilledIcon, fill: "solid" },
  { name: "image", keyline: "square", derivedFrom: undefined, Icon: PilotImageIcon, Filled: PilotImageFilledIcon, fill: "solid" },
  { name: "inbox", keyline: "square", derivedFrom: undefined, Icon: PilotInboxIcon, Filled: PilotInboxFilledIcon, fill: "solid" },
  { name: "info", keyline: "circle", derivedFrom: undefined, Icon: PilotInfoIcon, Filled: PilotInfoFilledIcon, fill: "solid" },
  { name: "italic", keyline: "vertical", derivedFrom: undefined, Icon: PilotItalicIcon, Filled: PilotItalicFilledIcon, fill: "weight" },
  { name: "key", keyline: "circle", derivedFrom: undefined, Icon: PilotKeyIcon, Filled: PilotKeyFilledIcon, fill: "solid" },
  { name: "keyboard", keyline: "square", derivedFrom: undefined, Icon: PilotKeyboardIcon, Filled: PilotKeyboardFilledIcon, fill: "solid" },
  { name: "layers", keyline: "square", derivedFrom: undefined, Icon: PilotLayersIcon, Filled: PilotLayersFilledIcon, fill: "solid" },
  { name: "lightbulb", keyline: "vertical", derivedFrom: undefined, Icon: PilotLightbulbIcon, Filled: PilotLightbulbFilledIcon, fill: "solid" },
  { name: "link", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLinkIcon, Filled: PilotLinkFilledIcon, fill: "weight" },
  { name: "link-off", keyline: "square", derivedFrom: undefined, Icon: PilotLinkOffIcon, Filled: PilotLinkOffFilledIcon, fill: "weight" },
  { name: "list", keyline: "horizontal", derivedFrom: undefined, Icon: PilotListIcon, Filled: PilotListFilledIcon, fill: "weight" },
  { name: "list-bullet", keyline: "square", derivedFrom: undefined, Icon: PilotListBulletIcon, Filled: PilotListBulletFilledIcon, fill: "weight" },
  { name: "loader", keyline: "circle", derivedFrom: undefined, Icon: PilotLoaderIcon, Filled: PilotLoaderFilledIcon, fill: "weight" },
  { name: "lock", keyline: "vertical", derivedFrom: undefined, Icon: PilotLockIcon, Filled: PilotLockFilledIcon, fill: "solid" },
  { name: "log-in", keyline: "square", derivedFrom: undefined, Icon: PilotLogInIcon, Filled: PilotLogInFilledIcon, fill: "weight" },
  { name: "log-out", keyline: "square", derivedFrom: undefined, Icon: PilotLogOutIcon, Filled: PilotLogOutFilledIcon, fill: "weight" },
  { name: "mail", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMailIcon, Filled: PilotMailFilledIcon, fill: "solid" },
  { name: "map", keyline: "square", derivedFrom: undefined, Icon: PilotMapIcon, Filled: PilotMapFilledIcon, fill: "weight" },
  { name: "megaphone", keyline: "square", derivedFrom: undefined, Icon: PilotMegaphoneIcon, Filled: PilotMegaphoneFilledIcon, fill: "solid" },
  { name: "menu", keyline: "square", derivedFrom: undefined, Icon: PilotMenuIcon, Filled: PilotMenuFilledIcon, fill: "weight" },
  { name: "mic", keyline: "vertical", derivedFrom: undefined, Icon: PilotMicIcon, Filled: PilotMicFilledIcon, fill: "solid" },
  { name: "mic-off", keyline: "square", derivedFrom: undefined, Icon: PilotMicOffIcon, Filled: PilotMicOffFilledIcon, fill: "solid" },
  { name: "minus", keyline: "square", derivedFrom: undefined, Icon: PilotMinusIcon, Filled: PilotMinusFilledIcon, fill: "weight" },
  { name: "moon", keyline: "circle", derivedFrom: undefined, Icon: PilotMoonIcon, Filled: PilotMoonFilledIcon, fill: "solid" },
  { name: "more-horizontal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMoreHorizontalIcon, Filled: PilotMoreHorizontalFilledIcon, fill: "weight" },
  { name: "more-vertical", keyline: "vertical", derivedFrom: "more-horizontal", Icon: PilotMoreVerticalIcon, Filled: PilotMoreVerticalFilledIcon, fill: "weight" },
  { name: "move", keyline: "circle", derivedFrom: undefined, Icon: PilotMoveIcon, Filled: PilotMoveFilledIcon, fill: "weight" },
  { name: "music", keyline: "square", derivedFrom: undefined, Icon: PilotMusicIcon, Filled: PilotMusicFilledIcon, fill: "solid" },
  { name: "opacity", keyline: "square", derivedFrom: undefined, Icon: PilotOpacityIcon, Filled: PilotOpacityFilledIcon, fill: "weight" },
  { name: "open", keyline: "square", derivedFrom: undefined, Icon: PilotOpenIcon, Filled: PilotOpenFilledIcon, fill: "weight" },
  { name: "options", keyline: "square", derivedFrom: undefined, Icon: PilotOptionsIcon, Filled: PilotOptionsFilledIcon, fill: "solid" },
  { name: "package", keyline: "square", derivedFrom: undefined, Icon: PilotPackageIcon, Filled: PilotPackageFilledIcon, fill: "solid" },
  { name: "padding", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingIcon, Filled: PilotPaddingFilledIcon, fill: "solid" },
  { name: "padding-ends", keyline: "square", derivedFrom: "padding-sides", Icon: PilotPaddingEndsIcon, Filled: PilotPaddingEndsFilledIcon, fill: "weight" },
  { name: "padding-sides", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingSidesIcon, Filled: PilotPaddingSidesFilledIcon, fill: "weight" },
  { name: "paintbrush", keyline: "vertical", derivedFrom: undefined, Icon: PilotPaintbrushIcon, Filled: PilotPaintbrushFilledIcon, fill: "solid" },
  { name: "panel-left", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelLeftIcon, Filled: PilotPanelLeftFilledIcon, fill: "solid" },
  { name: "panel-right", keyline: "horizontal", derivedFrom: "panel-left", Icon: PilotPanelRightIcon, Filled: PilotPanelRightFilledIcon, fill: "solid" },
  { name: "pause", keyline: "vertical", derivedFrom: undefined, Icon: PilotPauseIcon, Filled: PilotPauseFilledIcon, fill: "solid" },
  { name: "pencil", keyline: "square", derivedFrom: undefined, Icon: PilotPencilIcon, Filled: PilotPencilFilledIcon, fill: "solid" },
  { name: "people", keyline: "circle", derivedFrom: undefined, Icon: PilotPeopleIcon, Filled: PilotPeopleFilledIcon, fill: "solid" },
  { name: "person", keyline: "vertical", derivedFrom: undefined, Icon: PilotPersonIcon, Filled: PilotPersonFilledIcon, fill: "solid" },
  { name: "person-add", keyline: "square", derivedFrom: undefined, Icon: PilotPersonAddIcon, Filled: PilotPersonAddFilledIcon, fill: "solid" },
  { name: "person-remove", keyline: "square", derivedFrom: undefined, Icon: PilotPersonRemoveIcon, Filled: PilotPersonRemoveFilledIcon, fill: "solid" },
  { name: "phone", keyline: "vertical", derivedFrom: undefined, Icon: PilotPhoneIcon, Filled: PilotPhoneFilledIcon, fill: "solid" },
  { name: "pin", keyline: "vertical", derivedFrom: undefined, Icon: PilotPinIcon, Filled: PilotPinFilledIcon, fill: "solid" },
  { name: "play", keyline: "circle", derivedFrom: undefined, Icon: PilotPlayIcon, Filled: PilotPlayFilledIcon, fill: "solid" },
  { name: "plug", keyline: "vertical", derivedFrom: undefined, Icon: PilotPlugIcon, Filled: PilotPlugFilledIcon, fill: "solid" },
  { name: "pointer", keyline: "square", derivedFrom: undefined, Icon: PilotPointerIcon, Filled: PilotPointerFilledIcon, fill: "solid" },
  { name: "power", keyline: "circle", derivedFrom: undefined, Icon: PilotPowerIcon, Filled: PilotPowerFilledIcon, fill: "weight" },
  { name: "printer", keyline: "square", derivedFrom: undefined, Icon: PilotPrinterIcon, Filled: PilotPrinterFilledIcon, fill: "solid" },
  { name: "puzzle", keyline: "square", derivedFrom: undefined, Icon: PilotPuzzleIcon, Filled: PilotPuzzleFilledIcon, fill: "solid" },
  { name: "quote", keyline: "horizontal", derivedFrom: undefined, Icon: PilotQuoteIcon, Filled: PilotQuoteFilledIcon, fill: "weight" },
  { name: "receipt", keyline: "square", derivedFrom: undefined, Icon: PilotReceiptIcon, Filled: PilotReceiptFilledIcon, fill: "solid" },
  { name: "redo", keyline: "square", derivedFrom: "undo", Icon: PilotRedoIcon, Filled: PilotRedoFilledIcon, fill: "weight" },
  { name: "refresh", keyline: "circle", derivedFrom: "reset", Icon: PilotRefreshIcon, Filled: PilotRefreshFilledIcon, fill: "weight" },
  { name: "repeat", keyline: "square", derivedFrom: undefined, Icon: PilotRepeatIcon, Filled: PilotRepeatFilledIcon, fill: "weight" },
  { name: "reset", keyline: "circle", derivedFrom: undefined, Icon: PilotResetIcon, Filled: PilotResetFilledIcon, fill: "weight" },
  { name: "return", keyline: "square", derivedFrom: undefined, Icon: PilotReturnIcon, Filled: PilotReturnFilledIcon, fill: "weight" },
  { name: "rocket", keyline: "square", derivedFrom: undefined, Icon: PilotRocketIcon, Filled: PilotRocketFilledIcon, fill: "solid" },
  { name: "rotate", keyline: "square", derivedFrom: undefined, Icon: PilotRotateIcon, Filled: PilotRotateFilledIcon, fill: "solid" },
  { name: "ruler", keyline: "vertical", derivedFrom: undefined, Icon: PilotRulerIcon, Filled: PilotRulerFilledIcon, fill: "solid" },
  { name: "save", keyline: "square", derivedFrom: undefined, Icon: PilotSaveIcon, Filled: PilotSaveFilledIcon, fill: "solid" },
  { name: "scissors", keyline: "circle", derivedFrom: undefined, Icon: PilotScissorsIcon, Filled: PilotScissorsFilledIcon, fill: "weight" },
  { name: "search", keyline: "circle", derivedFrom: undefined, Icon: PilotSearchIcon, Filled: PilotSearchFilledIcon, fill: "weight" },
  { name: "send", keyline: "square", derivedFrom: undefined, Icon: PilotSendIcon, Filled: PilotSendFilledIcon, fill: "solid" },
  { name: "server", keyline: "circle", derivedFrom: undefined, Icon: PilotServerIcon, Filled: PilotServerFilledIcon, fill: "solid" },
  { name: "settings", keyline: "circle", derivedFrom: undefined, Icon: PilotSettingsIcon, Filled: PilotSettingsFilledIcon, fill: "solid" },
  { name: "shapes", keyline: "square", derivedFrom: undefined, Icon: PilotShapesIcon, Filled: PilotShapesFilledIcon, fill: "solid" },
  { name: "share", keyline: "vertical", derivedFrom: undefined, Icon: PilotShareIcon, Filled: PilotShareFilledIcon, fill: "weight" },
  { name: "shield", keyline: "circle", derivedFrom: undefined, Icon: PilotShieldIcon, Filled: PilotShieldFilledIcon, fill: "solid" },
  { name: "shopping-bag", keyline: "square", derivedFrom: undefined, Icon: PilotShoppingBagIcon, Filled: PilotShoppingBagFilledIcon, fill: "solid" },
  { name: "skip-back", keyline: "square", derivedFrom: "skip-forward", Icon: PilotSkipBackIcon, Filled: PilotSkipBackFilledIcon, fill: "solid" },
  { name: "skip-forward", keyline: "square", derivedFrom: undefined, Icon: PilotSkipForwardIcon, Filled: PilotSkipForwardFilledIcon, fill: "solid" },
  { name: "sliders", keyline: "square", derivedFrom: "options", Icon: PilotSlidersIcon, Filled: PilotSlidersFilledIcon, fill: "solid" },
  { name: "smile", keyline: "circle", derivedFrom: undefined, Icon: PilotSmileIcon, Filled: PilotSmileFilledIcon, fill: "solid" },
  { name: "sort", keyline: "square", derivedFrom: undefined, Icon: PilotSortIcon, Filled: PilotSortFilledIcon, fill: "weight" },
  { name: "sparkle", keyline: "circle", derivedFrom: undefined, Icon: PilotSparkleIcon, Filled: PilotSparkleFilledIcon, fill: "solid" },
  { name: "square-dashed", keyline: "square", derivedFrom: undefined, Icon: PilotSquareDashedIcon, Filled: PilotSquareDashedFilledIcon, fill: "weight" },
  { name: "star", keyline: "circle", derivedFrom: undefined, Icon: PilotStarIcon, Filled: PilotStarFilledIcon, fill: "solid" },
  { name: "status-available", keyline: "circle", derivedFrom: undefined, Icon: PilotStatusAvailableIcon, Filled: PilotStatusAvailableFilledIcon, fill: "solid" },
  { name: "sticky-note", keyline: "square", derivedFrom: undefined, Icon: PilotStickyNoteIcon, Filled: PilotStickyNoteFilledIcon, fill: "solid" },
  { name: "stop", keyline: "square", derivedFrom: undefined, Icon: PilotStopIcon, Filled: PilotStopFilledIcon, fill: "solid" },
  { name: "strikethrough", keyline: "square", derivedFrom: undefined, Icon: PilotStrikethroughIcon, Filled: PilotStrikethroughFilledIcon, fill: "weight" },
  { name: "sun", keyline: "circle", derivedFrom: undefined, Icon: PilotSunIcon, Filled: PilotSunFilledIcon, fill: "solid" },
  { name: "table", keyline: "square", derivedFrom: undefined, Icon: PilotTableIcon, Filled: PilotTableFilledIcon, fill: "solid" },
  { name: "tag", keyline: "circle", derivedFrom: undefined, Icon: PilotTagIcon, Filled: PilotTagFilledIcon, fill: "solid" },
  { name: "terminal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTerminalIcon, Filled: PilotTerminalFilledIcon, fill: "solid" },
  { name: "text", keyline: "square", derivedFrom: undefined, Icon: PilotTextIcon, Filled: PilotTextFilledIcon, fill: "weight" },
  { name: "thumbs-down", keyline: "square", derivedFrom: "thumbs-up", Icon: PilotThumbsDownIcon, Filled: PilotThumbsDownFilledIcon, fill: "solid" },
  { name: "thumbs-up", keyline: "square", derivedFrom: undefined, Icon: PilotThumbsUpIcon, Filled: PilotThumbsUpFilledIcon, fill: "solid" },
  { name: "token", keyline: "circle", derivedFrom: undefined, Icon: PilotTokenIcon, Filled: PilotTokenFilledIcon, fill: "solid" },
  { name: "trash", keyline: "vertical", derivedFrom: undefined, Icon: PilotTrashIcon, Filled: PilotTrashFilledIcon, fill: "solid" },
  { name: "trending-up", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTrendingUpIcon, Filled: PilotTrendingUpFilledIcon, fill: "weight" },
  { name: "trophy", keyline: "square", derivedFrom: undefined, Icon: PilotTrophyIcon, Filled: PilotTrophyFilledIcon, fill: "solid" },
  { name: "underline", keyline: "vertical", derivedFrom: undefined, Icon: PilotUnderlineIcon, Filled: PilotUnderlineFilledIcon, fill: "weight" },
  { name: "undo", keyline: "square", derivedFrom: undefined, Icon: PilotUndoIcon, Filled: PilotUndoFilledIcon, fill: "weight" },
  { name: "unlock", keyline: "vertical", derivedFrom: undefined, Icon: PilotUnlockIcon, Filled: PilotUnlockFilledIcon, fill: "solid" },
  { name: "upload", keyline: "square", derivedFrom: undefined, Icon: PilotUploadIcon, Filled: PilotUploadFilledIcon, fill: "weight" },
  { name: "video", keyline: "horizontal", derivedFrom: undefined, Icon: PilotVideoIcon, Filled: PilotVideoFilledIcon, fill: "solid" },
  { name: "video-off", keyline: "square", derivedFrom: undefined, Icon: PilotVideoOffIcon, Filled: PilotVideoOffFilledIcon, fill: "solid" },
  { name: "volume", keyline: "square", derivedFrom: undefined, Icon: PilotVolumeIcon, Filled: PilotVolumeFilledIcon, fill: "solid" },
  { name: "volume-off", keyline: "square", derivedFrom: undefined, Icon: PilotVolumeOffIcon, Filled: PilotVolumeOffFilledIcon, fill: "solid" },
  { name: "wallet", keyline: "square", derivedFrom: undefined, Icon: PilotWalletIcon, Filled: PilotWalletFilledIcon, fill: "solid" },
  { name: "warning", keyline: "circle", derivedFrom: undefined, Icon: PilotWarningIcon, Filled: PilotWarningFilledIcon, fill: "solid" },
  { name: "wifi", keyline: "horizontal", derivedFrom: undefined, Icon: PilotWifiIcon, Filled: PilotWifiFilledIcon, fill: "weight" },
  { name: "wifi-off", keyline: "circle", derivedFrom: undefined, Icon: PilotWifiOffIcon, Filled: PilotWifiOffFilledIcon, fill: "weight" },
  { name: "zoom-in", keyline: "circle", derivedFrom: undefined, Icon: PilotZoomInIcon, Filled: PilotZoomInFilledIcon, fill: "weight" },
  { name: "zoom-out", keyline: "circle", derivedFrom: undefined, Icon: PilotZoomOutIcon, Filled: PilotZoomOutFilledIcon, fill: "weight" },
] as const;
