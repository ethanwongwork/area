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

export const PilotActivityIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8.5L3.65 8.5A0.5 0.5 0 0 0 4.12 8.171L5.105 5.462A1 1 0 0 1 6.973 5.432L9.12 10.8A1 1 0 0 0 10.962 10.835L11.868 8.797A0.5 0.5 0 0 1 12.325 8.5L14.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotActivityFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 1.688 8.5 L 3.65 8.5 A 0.5 0.5 0 0 0 4.12 8.171 L 5.105 5.462 A 1 1 0 0 1 6.973 5.432 L 9.12 10.8 A 1 1 0 0 0 10.962 10.835 L 11.868 8.797 A 0.5 0.5 0 0 1 12.325 8.5 L 14.313 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

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

export const PilotAddCircleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5V11M5 8H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAddCircleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 5V11M5 8H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAlarmIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="9" r="4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7V9L9.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 5L4 3M12 3L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.818 12.182L3.5 13.5M11.182 12.182L12.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlarmFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 7V9L9.5 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="9" r="4.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2 5L4 3M12 3L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.818 12.182L3.5 13.5M11.182 12.182L12.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8 2.5V3.5M8 6.5V9.5M8 12.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M8 2.5V3.5M8 6.5V9.5M8 12.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotAnchorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="3.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5V13.5M5.5 7H10.5M3 8.5A5 5 0 0 0 13 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAnchorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="3.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8 5 V 13.5 M 5.688 7 H 10.313 M 3.006 8.745 A 5 5 0 0 0 12.994 8.745" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotArrowDownLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(180 8 8)">
      <path d="M2.5 13.5L13.5 2.5M8 2.5H13.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowDownLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(180 8 8)">
        <path d="M 2.633 13.367 L 13.5 2.5 M 8.188 2.5 H 13.5 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowDownRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(90 8 8)">
      <path d="M2.5 13.5L13.5 2.5M8 2.5H13.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowDownRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(90 8 8)">
        <path d="M 2.633 13.367 L 13.5 2.5 M 8.188 2.5 H 13.5 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotArrowUpCircleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V5M5 8L8 5L11 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotArrowUpCircleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 11V5M5 8L8 5L11 8" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowUpLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(270 8 8)">
      <path d="M2.5 13.5L13.5 2.5M8 2.5H13.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotArrowUpLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(270 8 8)">
        <path d="M 2.633 13.367 L 13.5 2.5 M 8.188 2.5 H 13.5 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotArrowUpRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 13.5L13.5 2.5M8 2.5H13.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotArrowUpRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.633 13.367 L 13.5 2.5 M 8.188 2.5 H 13.5 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M9 12L10.5 13.5L13.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotAwardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="6.5" r="4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 10L5.148 12.819A0.75 0.75 0 0 0 6.129 13.624L7.763 13.079A0.75 0.75 0 0 1 8.237 13.079L9.871 13.624A0.75 0.75 0 0 0 10.852 12.819L10.5 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAwardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="6.5" r="4" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10L5.148 12.819A0.75 0.75 0 0 0 6.129 13.624L7.763 13.079A0.75 0.75 0 0 1 8.237 13.079L9.871 13.624A0.75 0.75 0 0 0 10.852 12.819L10.5 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotBankIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.004 5.574L7.476 2.823A1 1 0 0 1 8.524 2.823L12.996 5.574A0.5 0.5 0 0 1 12.733 6.5L3.267 6.5A0.5 0.5 0 0 1 3.004 5.574Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6.5V13.5M8 6.5V13.5M11.5 6.5V13.5M2.5 13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBankFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.004 5.574L7.476 2.823A1 1 0 0 1 8.524 2.823L12.996 5.574A0.5 0.5 0 0 1 12.733 6.5L3.267 6.5A0.5 0.5 0 0 1 3.004 5.574Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 6.5V13.5M8 6.5V13.5M11.5 6.5V13.5M2.5 13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBanknoteIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="4" width="12" height="8" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBanknoteFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="4" width="12" height="8" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBarChartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 11V8.5M8.5 11V6M11.5 11V4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBarChartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 2.688 V 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.5 10.813 V 8.688 M 8.5 10.813 V 6.188 M 11.5 10.813 V 4.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBarcodeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 3.5V12.5M5 3.5V12.5M8 3.5V12.5M10.5 3.5V12.5M13.5 3.5V12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBarcodeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 3.688 V 12.313 M 5 3.688 V 12.313 M 8 3.688 V 12.313 M 10.5 3.688 V 12.313 M 13.5 3.688 V 12.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M14.5 6.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M4 12.625H12" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8C12.5 9.5 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotBlurIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2A6 6 0 0 0 8 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5H13.196M8 8H14M8 11H13.196" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBlurFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 2A6 6 0 0 0 8 14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5H13.196M8 8H14M8 11H13.196" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotBookmarkAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5V9M6 7H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBookmarkAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 5V9M6 7H10" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBookmarkRemoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 7H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBookmarkRemoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6 7H10" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5 2L11 2A1.5 1.5 0 0 1 12.5 3.5L12.5 13.225A0.75 0.75 0 0 1 11.386 13.881L8.243 12.135A0.5 0.5 0 0 0 7.757 12.135L4.614 13.881A0.75 0.75 0 0 1 3.5 13.225L3.5 3.5A1.5 1.5 0 0 1 5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotBooleanExcludeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 2.5L8 2.5A1.5 1.5 0 0 1 9.5 4L9.5 6A0.5 0.5 0 0 0 10 6.5L12 6.5A1.5 1.5 0 0 1 13.5 8L13.5 12A1.5 1.5 0 0 1 12 13.5L8 13.5A1.5 1.5 0 0 1 6.5 12L6.5 10A0.5 0.5 0 0 0 6 9.5L4 9.5A1.5 1.5 0 0 1 2.5 8L2.5 4A1.5 1.5 0 0 1 4 2.5ZM6.5 8A1.5 1.5 0 0 1 8 6.5H9.5V8A1.5 1.5 0 0 1 8 9.5H6.5Z" fill="currentColor" fillRule="evenodd" />
    <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBooleanExcludeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4 2.5L8 2.5A1.5 1.5 0 0 1 9.5 4L9.5 6A0.5 0.5 0 0 0 10 6.5L12 6.5A1.5 1.5 0 0 1 13.5 8L13.5 12A1.5 1.5 0 0 1 12 13.5L8 13.5A1.5 1.5 0 0 1 6.5 12L6.5 10A0.5 0.5 0 0 0 6 9.5L4 9.5A1.5 1.5 0 0 1 2.5 8L2.5 4A1.5 1.5 0 0 1 4 2.5ZM6.5 8A1.5 1.5 0 0 1 8 6.5H9.5V8A1.5 1.5 0 0 1 8 9.5H6.5Z" fill="currentColor" fillRule="evenodd" />
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBooleanIntersectIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 8A1.5 1.5 0 0 1 8 6.5H9.5V8A1.5 1.5 0 0 1 8 9.5H6.5Z" fill="currentColor" />
    <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBooleanIntersectFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.5 8A1.5 1.5 0 0 1 8 6.5H9.5V8A1.5 1.5 0 0 1 8 9.5H6.5Z" fill="currentColor" />
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBooleanSubtractIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 2.5H8A1.5 1.5 0 0 1 9.5 4V6.5H8A1.5 1.5 0 0 0 6.5 8V9.5H4A1.5 1.5 0 0 1 2.5 8V4A1.5 1.5 0 0 1 4 2.5Z" fill="currentColor" />
    <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBooleanSubtractFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4 2.5H8A1.5 1.5 0 0 1 9.5 4V6.5H8A1.5 1.5 0 0 0 6.5 8V9.5H4A1.5 1.5 0 0 1 2.5 8V4A1.5 1.5 0 0 1 4 2.5Z" fill="currentColor" />
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBooleanUnionIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 2.5L8 2.5A1.5 1.5 0 0 1 9.5 4L9.5 6A0.5 0.5 0 0 0 10 6.5L12 6.5A1.5 1.5 0 0 1 13.5 8L13.5 12A1.5 1.5 0 0 1 12 13.5L8 13.5A1.5 1.5 0 0 1 6.5 12L6.5 10A0.5 0.5 0 0 0 6 9.5L4 9.5A1.5 1.5 0 0 1 2.5 8L2.5 4A1.5 1.5 0 0 1 4 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBooleanUnionFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4 2.5L8 2.5A1.5 1.5 0 0 1 9.5 4L9.5 6A0.5 0.5 0 0 0 10 6.5L12 6.5A1.5 1.5 0 0 1 13.5 8L13.5 12A1.5 1.5 0 0 1 12 13.5L8 13.5A1.5 1.5 0 0 1 6.5 12L6.5 10A0.5 0.5 0 0 0 6 9.5L4 9.5A1.5 1.5 0 0 1 2.5 8L2.5 4A1.5 1.5 0 0 1 4 2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBotIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="6" width="12" height="7.5" rx="2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBotFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="6" width="12" height="7.5" rx="2.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBracesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 2.5H5.5A1.5 1.5 0 0 0 4 4V6.5A1.5 1.5 0 0 1 2.5 8A1.5 1.5 0 0 1 4 9.5V12A1.5 1.5 0 0 0 5.5 13.5H6M10 2.5H10.5A1.5 1.5 0 0 1 12 4V6.5A1.5 1.5 0 0 0 13.5 8A1.5 1.5 0 0 0 12 9.5V12A1.5 1.5 0 0 1 10.5 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBracesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.813 2.5 H 5.5 A 1.5 1.5 0 0 0 4 4 V 6.5 A 1.5 1.5 0 0 1 2.5 8 A 1.5 1.5 0 0 1 4 9.5 V 12 A 1.5 1.5 0 0 0 5.5 13.5 H 5.813 M 10.188 2.5 H 10.5 A 1.5 1.5 0 0 1 12 4 V 6.5 A 1.5 1.5 0 0 0 13.5 8 A 1.5 1.5 0 0 0 12 9.5 V 12 A 1.5 1.5 0 0 1 10.5 13.5 H 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5.5 5V3.5A1.5 1.5 0 0 1 7 2H9A1.5 1.5 0 0 1 10.5 3.5V5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M7 2V3.5A1 1 0 0 0 9 3.5V2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 6A2 2 0 0 1 3 4V2.5M11 6A2 2 0 0 0 13 4V2.5M2.5 8.5H5M11 8.5H13.5M5.402 11A2.402 2.402 0 0 0 3 13.402V14M10.598 11A2.402 2.402 0 0 1 13 13.402V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotBuildingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3" y="1.5" width="10" height="12.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6.25" cy="4.75" r="0.75" fill="currentColor" />
    <circle cx="9.75" cy="4.75" r="0.75" fill="currentColor" />
    <circle cx="6.25" cy="8" r="0.75" fill="currentColor" />
    <circle cx="9.75" cy="8" r="0.75" fill="currentColor" />
    <path d="M6.5 14V12.25A1.5 1.5 0 0 1 9.5 12.25V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBuildingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6.25" cy="4.75" r="0.75" fill="black" />
        <circle cx="9.75" cy="4.75" r="0.75" fill="black" />
        <circle cx="6.25" cy="8" r="0.75" fill="black" />
        <circle cx="9.75" cy="8" r="0.75" fill="black" />
        <path d="M6.5 14V12.25A1.5 1.5 0 0 1 9.5 12.25V14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCalendarAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.469 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 6A2 2 0 0 1 4.5 4L11.5 4A2 2 0 0 1 13.5 6L13.5 8.469" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 7H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 9.5V13.5M9.5 11.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCalendarAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 7L2.5 7H13.5L15.5 7" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M11.5 9.5V13.5M9.5 11.5H13.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 4H11.5A2 2 0 0 1 13.5 6V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V6A2 2 0 0 1 4.5 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCalendarCheckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.304 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 6A2 2 0 0 1 4.5 4L11.5 4A2 2 0 0 1 13.5 6L13.5 7.796" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 7H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 11.5L10 13L13 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCalendarCheckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 7L2.5 7H13.5L15.5 7" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M8.5 11.5L10 13L13 10" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 4H11.5A2 2 0 0 1 13.5 6V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V6A2 2 0 0 1 4.5 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCalendarRemoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.448 13.5L4.5 13.5A2 2 0 0 1 2.5 11.5L2.5 6A2 2 0 0 1 4.5 4L11.5 4A2 2 0 0 1 13.5 6L13.5 9.24" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 7H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 11.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCalendarRemoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 7L2.5 7H13.5L15.5 7" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M9.5 11.5H13.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 4H11.5A2 2 0 0 1 13.5 6V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V6A2 2 0 0 1 4.5 4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M5.5 2.5V4.5M10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCallIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.638 5.162C3.732 4.479 3.972 3.45 4.303 2.959C4.635 2.469 5.139 2.254 5.627 2.219C6.115 2.185 6.865 2.438 7.234 2.75C7.602 3.063 7.794 3.601 7.839 4.092C7.885 4.582 7.717 5.276 7.506 5.693C7.294 6.109 6.761 6.322 6.571 6.593C6.382 6.863 6.331 7.018 6.37 7.317C6.409 7.616 6.623 8.039 6.803 8.386C6.984 8.733 7.23 9.118 7.453 9.399C7.675 9.679 7.867 9.994 8.141 10.071C8.414 10.149 8.681 9.919 9.094 9.862C9.508 9.805 10.171 9.592 10.621 9.729C11.071 9.866 11.513 10.271 11.796 10.683C12.079 11.096 12.4 11.738 12.319 12.204C12.238 12.67 11.717 13.188 11.311 13.478C10.905 13.768 10.372 13.918 9.882 13.941C9.392 13.964 8.81 13.816 8.371 13.616C7.932 13.417 7.591 13.052 7.248 12.745C6.906 12.437 6.609 12.112 6.315 11.771C6.021 11.43 5.742 11.069 5.485 10.699C5.229 10.329 4.992 9.945 4.777 9.55C4.561 9.156 4.364 8.747 4.191 8.331C4.018 7.916 3.83 7.585 3.738 7.057C3.646 6.529 3.544 5.845 3.638 5.162Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCallFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.638 5.162C3.732 4.479 3.972 3.45 4.303 2.959C4.635 2.469 5.139 2.254 5.627 2.219C6.115 2.185 6.865 2.438 7.234 2.75C7.602 3.063 7.794 3.601 7.839 4.092C7.885 4.582 7.717 5.276 7.506 5.693C7.294 6.109 6.761 6.322 6.571 6.593C6.382 6.863 6.331 7.018 6.37 7.317C6.409 7.616 6.623 8.039 6.803 8.386C6.984 8.733 7.23 9.118 7.453 9.399C7.675 9.679 7.867 9.994 8.141 10.071C8.414 10.149 8.681 9.919 9.094 9.862C9.508 9.805 10.171 9.592 10.621 9.729C11.071 9.866 11.513 10.271 11.796 10.683C12.079 11.096 12.4 11.738 12.319 12.204C12.238 12.67 11.717 13.188 11.311 13.478C10.905 13.768 10.372 13.918 9.882 13.941C9.392 13.964 8.81 13.816 8.371 13.616C7.932 13.417 7.591 13.052 7.248 12.745C6.906 12.437 6.609 12.112 6.315 11.771C6.021 11.43 5.742 11.069 5.485 10.699C5.229 10.329 4.992 9.945 4.777 9.55C4.561 9.156 4.364 8.747 4.191 8.331C4.018 7.916 3.83 7.585 3.738 7.057C3.646 6.529 3.544 5.845 3.638 5.162Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCallEndIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 10.5H5A1 1 0 0 0 6 9.5V8.4C7.3 7.9 8.7 7.9 10 8.4V9.5A1 1 0 0 0 11 10.5H12.5A1 1 0 0 0 13.5 9.5V8.5C13.5 6.8 11 5 8 5C5 5 2.5 6.8 2.5 8.5V9.5A1 1 0 0 0 3.5 10.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCallEndFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.5 10.5H5A1 1 0 0 0 6 9.5V8.4C7.3 7.9 8.7 7.9 10 8.4V9.5A1 1 0 0 0 11 10.5H12.5A1 1 0 0 0 13.5 9.5V8.5C13.5 6.8 11 5 8 5C5 5 2.5 6.8 2.5 8.5V9.5A1 1 0 0 0 3.5 10.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCameraOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M12.823 12.823A2 2 0 0 1 12 13L4 13A2 2 0 0 1 2 11L2 6.5A2 2 0 0 1 4 4.5L4.5 4.5M6.591 3.409L7 3L9 3L10.5 4.5L12 4.5A2 2 0 0 1 14 6.5L14 10.818" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8.5A2 2 0 0 1 6.858 6.858M9.642 9.642A2 2 0 0 1 6 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCameraOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 6.5A2 2 0 0 1 4 4.5H5.5L7 3H9L10.5 4.5H12A2 2 0 0 1 14 6.5V11A2 2 0 0 1 12 13H4A2 2 0 0 1 2 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCaptionsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 6.5H7M9.5 6.5H11M5 9.5H6.5M9 9.5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCaptionsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 6.5H7M9.5 6.5H11M5 9.5H6.5M9 9.5H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="6.5" width="11" height="5.5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6.5L4.336 3.814A1.5 1.5 0 0 1 5.824 2.5L10.176 2.5A1.5 1.5 0 0 1 11.664 3.814L12 6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6.5H2M12 6.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="9.25" r="0.75" fill="currentColor" />
    <circle cx="11" cy="9.25" r="0.75" fill="currentColor" />
    <path d="M4.5 12V13.5M11.5 12V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCarFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="5" cy="9.25" r="0.75" fill="black" />
        <circle cx="11" cy="9.25" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="6.5" width="11" height="5.5" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M4 6.5L4.336 3.814A1.5 1.5 0 0 1 5.824 2.5L10.176 2.5A1.5 1.5 0 0 1 11.664 3.814L12 6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6.5H2M12 6.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 12V13.5M11.5 12V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotChatAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 12.689L2.5 4.5A2 2 0 0 1 4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 9.5A2 2 0 0 1 11.5 11.5L5.707 11.5A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5V9M6 7H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChatAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 5V9M6 7H10" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.5 12.689L2.5 4.5A2 2 0 0 1 4.5 2.5L11.5 2.5A2 2 0 0 1 13.5 4.5L13.5 9.5A2 2 0 0 1 11.5 11.5L5.707 11.5A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotChatMultipleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 12.689V7A1.5 1.5 0 0 1 4 5.5H9A1.5 1.5 0 0 1 10.5 7V10A1.5 1.5 0 0 1 9 11.5H5.707A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5H12A1.5 1.5 0 0 1 13.5 4V8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChatMultipleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 12.689V7A1.5 1.5 0 0 1 4 5.5H9A1.5 1.5 0 0 1 10.5 7V10A1.5 1.5 0 0 1 9 11.5H5.707A0.5 0.5 0 0 0 5.354 11.646L3.78 13.22A0.75 0.75 0 0 1 2.5 12.689Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 2.5H12A1.5 1.5 0 0 1 13.5 4V8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCheckboxIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8L7 10L11 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCheckboxFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 8L7 10L11 6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotChevronsUpDownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 5.5L8 2L11.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 10.5L8 14L11.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChevronsUpDownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.633 5.367 L 8 2 L 11.367 5.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4.633 10.633 L 8 14 L 11.367 10.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotChipIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 2V3.5M8 2V3.5M11 2V3.5M5 12.5V14M8 12.5V14M11 12.5V14M2 5H3.5M2 8H3.5M2 11H3.5M12.5 5H14M12.5 8H14M12.5 11H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChipFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M5 2V3.5M8 2V3.5M11 2V3.5M5 12.5V14M8 12.5V14M11 12.5V14M2 5H3.5M2 8H3.5M2 11H3.5M12.5 5H14M12.5 8H14M12.5 11H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCloudDownloadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.309 12.199A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 0 1 12.762 11.915" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.5V14M5.5 11.5L8 14L10.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudDownloadFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 7.5V14M5.5 11.5L8 14L10.5 11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 1 1 11 12.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCloudLightningIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.984 11L4.5 11A2.5 2.5 0 0 1 4.042 6.042A3.5 3.5 0 1 1 10.964 5A3 3 0 0 1 12.111 10.78" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 8L7 10L10 10L6.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudLightningFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M9 8L7 10L10 10L6.5 13.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size, 3) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 11A2.5 2.5 0 0 1 4.042 6.042A3.5 3.5 0 1 1 10.964 5A3 3 0 1 1 11 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M9 8L7 10L10 10L6.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCloudOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M12.229 12.229A3 3 0 0 1 11 12.5L4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 0 1 4.796 4.796M6.774 3.592A3.5 3.5 0 0 1 10.964 6.5A3 3 0 0 1 13.776 10.594" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 12.5A2.5 2.5 0 0 1 4.042 7.542A3.5 3.5 0 1 1 10.964 6.5A3 3 0 1 1 11 12.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCloudRainIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 11A2.5 2.5 0 0 1 4.042 6.042A3.5 3.5 0 1 1 10.964 5A3 3 0 1 1 11 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 11L3.5 14M8 11L6.5 14M11 11L9.5 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudRainFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 11A2.5 2.5 0 0 1 4.042 6.042A3.5 3.5 0 1 1 10.964 5A3 3 0 1 1 11 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11L3.5 14M8 11L6.5 14M11 11L9.5 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCloudSunIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.667 14A1.667 1.667 0 0 1 7.362 10.695A2.333 2.333 0 1 1 11.976 10A2 2 0 1 1 12 14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.791 7.888A1.5 1.5 0 0 1 8.132 6.016M4.172 9.828L3.464 10.536M3 7L2 7M4.172 4.172L3.464 3.464M7 3L7 2M9.828 4.172L10.536 3.464" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCloudSunFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.667 14A1.667 1.667 0 0 1 7.362 10.695A2.333 2.333 0 1 1 11.976 10A2 2 0 1 1 12 14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.791 7.888A1.5 1.5 0 0 1 8.132 6.016M4.172 9.828L3.464 10.536M3 7L2 7M4.172 4.172L3.464 3.464M7 3L7 2M9.828 4.172L10.536 3.464" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCodeBlockIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 6.5L5 8L6.5 9.5M9.5 6.5L11 8L9.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCodeBlockFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 6.5L5 8L6.5 9.5M9.5 6.5L11 8L9.5 9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M10.5 9H12A1.75 1.75 0 0 1 12 12.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.25 2C4.75 3 1.75 4 3.25 5M6.25 2C7.75 3 4.75 4 6.25 5M9.25 2C10.75 3 7.75 4 9.25 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCoinsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.214 6.669A4 4 0 1 1 6.669 12.214" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCoinsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.875 6A5.125 5.125 0 1 0 11.125 6A5.125 5.125 0 1 0 0.875 6Z" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="6" cy="6" r="4" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10A4 4 0 1 0 14 10A4 4 0 1 0 6 10Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotCollapseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M9.5 3.5V6.5H12.5M13.5 2.5L9.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 12.5V9.5H3.5M2.5 13.5L6.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCollapseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 9.5 3.688 V 6.5 H 12.313 M 13.367 2.633 L 9.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.5 12.313 V 9.5 H 3.688 M 2.633 13.367 L 6.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotColumnsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotColumnsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0.5L8 2.5V13.5L8 15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotComposeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.5H4.5A2 2 0 0 0 2.5 4.5V11.5A2 2 0 0 0 4.5 13.5H11.5A2 2 0 0 0 13.5 11.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.926 2.224A0.6 0.6 0 0 1 12.774 2.224L14 3.45A0.6 0.6 0 0 1 13.974 4.323L9.101 8.654A0.3 0.3 0 0 1 8.984 8.719L7.605 9.113A0.45 0.45 0 0 1 7.035 8.624L7.237 7.002A0.3 0.3 0 0 1 7.323 6.827Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotComposeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M11.926 2.224A0.6 0.6 0 0 1 12.774 2.224L14 3.45A0.6 0.6 0 0 1 13.974 4.323L9.101 8.654A0.3 0.3 0 0 1 8.984 8.719L7.605 9.113A0.45 0.45 0 0 1 7.035 8.624L7.237 7.002A0.3 0.3 0 0 1 7.323 6.827Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2.5H4.5A2 2 0 0 0 2.5 4.5V11.5A2 2 0 0 0 4.5 13.5H11.5A2 2 0 0 0 13.5 11.5V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotContrastIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V14A6 6 0 0 0 8 2Z" fill="currentColor" />
  </svg>
);

export const PilotContrastFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2V14A6 6 0 0 0 8 2Z" fill="currentColor" />
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
      <path d="M2.5 8.5V4A1.5 1.5 0 0 1 4 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotCrownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.85 5.8L4.772 7.029A0.75 0.75 0 0 0 6.043 6.915L7.329 4.342A0.75 0.75 0 0 1 8.671 4.342L9.957 6.915A0.75 0.75 0 0 0 11.228 7.029L12.15 5.8A0.75 0.75 0 0 1 13.5 6.25L13.5 11A1.5 1.5 0 0 1 12 12.5L4 12.5A1.5 1.5 0 0 1 2.5 11L2.5 6.25A0.75 0.75 0 0 1 3.85 5.8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCrownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3.85 5.8L4.772 7.029A0.75 0.75 0 0 0 6.043 6.915L7.329 4.342A0.75 0.75 0 0 1 8.671 4.342L9.957 6.915A0.75 0.75 0 0 0 11.228 7.029L12.15 5.8A0.75 0.75 0 0 1 13.5 6.25L13.5 11A1.5 1.5 0 0 1 12 12.5L4 12.5A1.5 1.5 0 0 1 2.5 11L2.5 6.25A0.75 0.75 0 0 1 3.85 5.8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8 11V13.5M5.5 13.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDiamondIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.707 2.707L13.293 7.293A1 1 0 0 1 13.293 8.707L8.707 13.293A1 1 0 0 1 7.293 13.293L2.707 8.707A1 1 0 0 1 2.707 7.293L7.293 2.707A1 1 0 0 1 8.707 2.707Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDiamondFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8.707 2.707L13.293 7.293A1 1 0 0 1 13.293 8.707L8.707 13.293A1 1 0 0 1 7.293 13.293L2.707 8.707A1 1 0 0 1 2.707 7.293L7.293 2.707A1 1 0 0 1 8.707 2.707Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotDistributeHorizontalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6.5" y="4.5" width="3" height="7" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDistributeHorizontalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="6.5" y="4.5" width="3" height="7" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 2.5V13.5M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDistributeVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <path d="M2.5 2.5V13.5M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6.5" y="4.5" width="3" height="7" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotDistributeVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <rect x="6.5" y="4.5" width="3" height="7" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 2.5V13.5M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotDocumentAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.306 14L5.5 14A2 2 0 0 1 3.5 12L3.5 4A2 2 0 0 1 5.5 2L8 2L12.5 6.5L12.5 8.469" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 9.5V13.5M8.5 11.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M10.5 9.5V13.5M8.5 11.5H12.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotDocumentCheckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.804 14L5.5 14A2 2 0 0 1 3.5 12L3.5 4A2 2 0 0 1 5.5 2L8 2L12.5 6.5L12.5 8.24" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12L9.5 13.5L12.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentCheckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M8 12L9.5 13.5L12.5 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotDocumentRemoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.45 13.76A2 2 0 0 1 10.5 14L5.5 14A2 2 0 0 1 3.5 12L3.5 4A2 2 0 0 1 5.5 2L8 2L12.5 6.5L12.5 9.24" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 11.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentRemoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M8.5 11.5H12.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotEllipseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEllipseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotEraserIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.707 9.293L8.293 3.707A1 1 0 0 1 9.707 3.707L10.793 4.793A1 1 0 0 1 10.793 6.207L5.207 11.793A1 1 0 0 1 3.793 11.793L2.707 10.707A1 1 0 0 1 2.707 9.293Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 7.5L7 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 12.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEraserFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M3.086 6.086L4.5 7.5L7 10L8.414 11.414" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.707 9.293L8.293 3.707A1 1 0 0 1 9.707 3.707L10.793 4.793A1 1 0 0 1 10.793 6.207L5.207 11.793A1 1 0 0 1 3.793 11.793L2.707 10.707A1 1 0 0 1 2.707 9.293Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M4.5 12.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotEscapeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 8.5A5 5 0 0 0 13.5 8.5A5 5 0 0 0 7.767 3.554" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 8.5L2.5 2.5M2.5 5.5V2.5H5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEscapeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.506 8.745 A 5 5 0 0 0 13.5 8.5 A 5 5 0 0 0 8.033 3.522" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.367 8.367 L 2.5 2.5 M 2.5 5.313 V 2.5 H 5.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M6.846 4.911L11.089 9.154" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFastForwardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.207 4.207L7.47 7.47A0.75 0.75 0 0 1 7.47 8.53L4.207 11.793A1 1 0 0 1 2.5 11.086L2.5 4.914A1 1 0 0 1 4.207 4.207Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.707 4.207L12.97 7.47A0.75 0.75 0 0 1 12.97 8.53L9.707 11.793A1 1 0 0 1 8 11.086L8 4.914A1 1 0 0 1 9.707 4.207Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFastForwardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.207 4.207L7.47 7.47A0.75 0.75 0 0 1 7.47 8.53L4.207 11.793A1 1 0 0 1 2.5 11.086L2.5 4.914A1 1 0 0 1 4.207 4.207Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.707 4.207L12.97 7.47A0.75 0.75 0 0 1 12.97 8.53L9.707 11.793A1 1 0 0 1 8 11.086L8 4.914A1 1 0 0 1 9.707 4.207Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFileCodeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2L8 2L12.5 6.5L12.5 7.256M5.747 14L5.5 14A2 2 0 0 1 3.5 12L3.5 4A2 2 0 0 1 5.5 2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9L6 11L8 13M11 9L13 11L11 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFileCodeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M8 9L6 11L8 13M11 9L13 11L11 13" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size, 3) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M8 9L6 11L8 13M11 9L13 11L11 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFileImageIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 14L8.793 11.207A1 1 0 0 1 10.207 11.207L12.142 13.142" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="7" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotFileImageFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5L14.5 6.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M4.586 15.414L6 14L8.793 11.207A1 1 0 0 1 10.207 11.207L12.142 13.142L13.556 14.556" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <circle cx="6" cy="7" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M5.5 2H8L12.5 6.5V12A2 2 0 0 1 10.5 14H5.5A2 2 0 0 1 3.5 12V4A2 2 0 0 1 5.5 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotFilterAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.151 13.45L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291L2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.674 8.291A0.75 0.75 0 0 0 9.5 8.772L9.5 9.704" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10V14M10 12H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFilterAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8.151 13.45L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291L2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.674 8.291A0.75 0.75 0 0 0 9.5 8.772L9.5 9.704A2.35 2.35 0 0 0 8.151 13.45Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10V14M10 12H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFilterDismissIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.91 13.53L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291L2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.988 7.915" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.25 10.25L13.75 13.75M13.75 10.25L10.25 13.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFilterDismissFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M7.91 13.53L7.487 13.671A0.75 0.75 0 0 1 6.5 12.959L6.5 8.772A0.75 0.75 0 0 0 6.326 8.291L2.867 4.14A1 1 0 0 1 3.635 2.5L12.365 2.5A1 1 0 0 1 13.133 4.14L9.988 7.915A2.35 2.35 0 0 0 7.9 10.25L7.91 13.53Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 10.25L13.75 13.75M13.75 10.25L10.25 13.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFingerprintIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.25 14C6.75 13.5 6.5 13 6.5 12.25V8.5A1.5 1.5 0 0 1 9.5 8.5V11C9.5 12 9.75 12.75 10.25 13.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 13.25C3.67 12.67 3.5 12 3.5 11.25V8.5A4.5 4.5 0 0 1 11.897 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 9.25V10.5C12.5 10.9 12.45 11.3 12.35 11.65" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 4.894A7 7 0 0 1 5.563 1.938" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.534 1.52A7 7 0 0 1 14 4.894" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFingerprintFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 7.25 14 C 6.75 13.5 6.5 13 6.5 12.25 V 8.5 A 1.5 1.5 0 0 1 9.5 8.5 V 11 C 9.5 12 9.75 12.75 10.25 13.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4 13.25 C 3.67 12.67 3.5 12 3.5 11.25 V 8.5 A 4.5 4.5 0 0 1 11.7 5.939" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12.5 9.438 V 10.5 C 12.5 10.9 12.45 11.3 12.35 11.65" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.117 4.706 A 7 7 0 0 1 5.357 2.018" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.742 1.539 A 7 7 0 0 1 13.89 4.717" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFlameIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 14C4.9 14 2.6 12 2.6 9.3C2.6 7.8 3.2 6.4 4.3 5.2C4.4 6.6 5 7.5 5.9 8C5.4 5.3 6.7 3.1 9 1.8C8.6 4 10.4 5.3 10.7 7.9C11.4 7.6 12 7.1 12.3 6.4C13 7.4 13.4 8.4 13.4 9.4C13.4 12 11.1 14 8 14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlameFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8 14C4.9 14 2.6 12 2.6 9.3C2.6 7.8 3.2 6.4 4.3 5.2C4.4 6.6 5 7.5 5.9 8C5.4 5.3 6.7 3.1 9 1.8C8.6 4 10.4 5.3 10.7 7.9C11.4 7.6 12 7.1 12.3 6.4C13 7.4 13.4 8.4 13.4 9.4C13.4 12 11.1 14 8 14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotFlaskIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 2.5L6.5 6.234A1 1 0 0 1 6.368 6.731L3.355 12.004A1 1 0 0 0 4.223 13.5L11.777 13.5A1 1 0 0 0 12.645 12.004L9.632 6.731A1 1 0 0 1 9.5 6.234L9.5 2.5L6.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 2.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.214 10.5H11.786" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFlaskFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M2.214 10.5L4.214 10.5H11.786L13.786 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.5 2.5L6.5 6.234A1 1 0 0 1 6.368 6.731L3.355 12.004A1 1 0 0 0 4.223 13.5L11.777 13.5A1 1 0 0 0 12.645 12.004L9.632 6.731A1 1 0 0 1 9.5 6.234L9.5 2.5L6.5 2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M5.5 2.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M2.5 11.5H13.5M11 9L13.5 11.5L11 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2.5 11.5H13.5M11 9L13.5 11.5L11 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotFolderAddIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.969 13L3.5 13A1.5 1.5 0 0 1 2 11.5L2 4.5A1.5 1.5 0 0 1 3.5 3L7 3L8.5 4.5L12.5 4.5A1.5 1.5 0 0 1 14 6L14 7.969" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6H7L8.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9V13M10 11H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderAddFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 6L2 6H7L8.5 4.5L9.914 3.086" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M12 9V13M10 11H14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 11.5V4.5A1.5 1.5 0 0 1 3.5 3H7L8.5 4.5H12.5A1.5 1.5 0 0 1 14 6V11.5A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFolderOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 11.5L2 4.5A1.5 1.5 0 0 1 3.5 3L7 3L8.5 4.5L12.5 4.5A1.5 1.5 0 0 1 14 6L14 7.264A1 1 0 0 1 13.894 7.711L11.665 12.171A1.5 1.5 0 0 1 10.323 13L3.5 13A1.5 1.5 0 0 1 2 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.25 13L8 7.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.356 14.789L5.25 13L8 7.5H14L16 7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 11.5L2 4.5A1.5 1.5 0 0 1 3.5 3L7 3L8.5 4.5L12.5 4.5A1.5 1.5 0 0 1 14 6L14 7.264A1 1 0 0 1 13.894 7.711L11.665 12.171A1.5 1.5 0 0 1 10.323 13L3.5 13A1.5 1.5 0 0 1 2 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFolderRemoveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.948 13L3.5 13A1.5 1.5 0 0 1 2 11.5L2 4.5A1.5 1.5 0 0 1 3.5 3L7 3L8.5 4.5L12.5 4.5A1.5 1.5 0 0 1 14 6L14 8.74" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6H7L8.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderRemoveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 6L2 6H7L8.5 4.5L9.914 3.086" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M10 11H14" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 11.5V4.5A1.5 1.5 0 0 1 3.5 3H7L8.5 4.5H12.5A1.5 1.5 0 0 1 14 6V11.5A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotForwardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M5.5 2.5L2.5 5.5L5.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 5.5H9A4.5 4.5 0 0 1 13.5 10V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotForwardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M 5.367 2.633 L 2.5 5.5 L 5.367 8.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.5 5.5 H 9 A 4.5 4.5 0 0 1 13.5 10 V 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFrameIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2V14M11.5 2V14M2 4.5H14M2 11.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFrameFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.5 2.188 V 13.813 M 11.5 2.188 V 13.813 M 2.188 4.5 H 13.813 M 2.188 11.5 H 13.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotFrownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="6" r="0.75" fill="currentColor" />
    <circle cx="10" cy="6" r="0.75" fill="currentColor" />
    <path d="M5.25 10.5A3.25 3.25 0 0 1 10.75 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFrownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6" cy="6" r="0.75" fill="black" />
        <circle cx="10" cy="6" r="0.75" fill="black" />
        <path d="M5.25 10.5A3.25 3.25 0 0 1 10.75 10.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFunctionIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11 2.5H10A2 2 0 0 0 8 4.5V11.5A2 2 0 0 1 6 13.5H5M5.5 6.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFunctionFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 10.813 2.5 H 10 A 2 2 0 0 0 8 4.5 V 11.5 A 2 2 0 0 1 6 13.5 H 5.188 M 5.688 6.5 H 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotGaugeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 11.5L2 10.5A6 6 0 0 1 8.886 4.566M13.017 7.21A6 6 0 0 1 14 10.5L14 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.145 11.501L11.615 5.856A0.5625 0.5625 0 0 0 10.647 5.297L6.993 10.259A1.25 1.25 0 1 0 9.145 11.501Z" fill="currentColor" />
  </svg>
);

export const PilotGaugeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2 11.313 L 2 10.5 A 6 6 0 0 1 8.566 4.527 M 13.133 7.394 A 6 6 0 0 1 14 10.5 L 14 11.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.145 11.501L11.615 5.856A0.5625 0.5625 0 0 0 10.647 5.297L6.993 10.259A1.25 1.25 0 1 0 9.145 11.501Z" fill="currentColor" />
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
      <path d="M8 5.5C6.5 5.5 4.5 5.2 4.5 3.75A1.25 1.25 0 0 1 5.75 2.5C7 2.5 8 4 8 5.5C8 4 9 2.5 10.25 2.5A1.25 1.25 0 0 1 11.5 3.75C11.5 5.2 9.5 5.5 8 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGitBranchIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4.5" cy="11.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 6.5C11.5 9.3 9.3 11.67 6.49 11.67" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGitBranchFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4.5" cy="11.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 2.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 6.5C11.5 9.3 9.3 11.67 6.49 11.67" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGitCommitIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8H6M10 8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGitCommitFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="8" cy="8" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 8H6M10 8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGitMergeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="11.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6.5V13.5M4.5 6.5A5 5 0 0 0 9.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGitMergeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="11.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 6.5V13.5M4.5 6.5A5 5 0 0 0 9.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGitPullRequestIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="4.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="11.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6.5V13.5M9 4.5A2.5 2.5 0 0 1 11.5 7V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGitPullRequestFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="4.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="11.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 6.5V13.5M9 4.5A2.5 2.5 0 0 1 11.5 7V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M-0.623 7.122L7.083 10.809A2.125 2.125 0 0 0 8.917 10.809L16.623 7.122" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8.431 3.206L13.431 5.598A1 1 0 0 1 13.431 7.402L8.431 9.794A1 1 0 0 1 7.569 9.794L2.569 7.402A1 1 0 0 1 2.569 5.598L7.569 3.206A1 1 0 0 1 8.431 3.206Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 8.326V11A3.5 2 0 0 0 11.5 11V8.326" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M14 6.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotGripIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 6H10.5M5.5 10H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotGripFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.688 6 H 10.313 M 5.688 10 H 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotGripHorizontalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="rotate(90 8 8)">
      <circle cx="6" cy="4" r="1" fill="currentColor" />
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="6" cy="8" r="1" fill="currentColor" />
      <circle cx="10" cy="8" r="1" fill="currentColor" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
    </g>
  </svg>
);

export const PilotGripHorizontalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="rotate(90 8 8)">
        <circle cx="6" cy="4" r="1.1875" fill="currentColor" />
        <circle cx="10" cy="4" r="1.1875" fill="currentColor" />
        <circle cx="6" cy="8" r="1.1875" fill="currentColor" />
        <circle cx="10" cy="8" r="1.1875" fill="currentColor" />
        <circle cx="6" cy="12" r="1.1875" fill="currentColor" />
        <circle cx="10" cy="12" r="1.1875" fill="currentColor" />
      </g>
    </svg>
  );
};

export const PilotGripVerticalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="6" cy="4" r="1" fill="currentColor" />
    <circle cx="10" cy="4" r="1" fill="currentColor" />
    <circle cx="6" cy="8" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="6" cy="12" r="1" fill="currentColor" />
    <circle cx="10" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const PilotGripVerticalFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="6" cy="4" r="1.1875" fill="currentColor" />
      <circle cx="10" cy="4" r="1.1875" fill="currentColor" />
      <circle cx="6" cy="8" r="1.1875" fill="currentColor" />
      <circle cx="10" cy="8" r="1.1875" fill="currentColor" />
      <circle cx="6" cy="12" r="1.1875" fill="currentColor" />
      <circle cx="10" cy="12" r="1.1875" fill="currentColor" />
    </svg>
  );
};

export const PilotHandIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7 7.5V4A1 1 0 0 0 5 4V9M9 7V3A1 1 0 0 0 7 3V4M11 7.5V4A1 1 0 0 0 9 4M11 5.5A1 1 0 0 1 13 5.5V9.5A4 4 0 0 1 9 13.5H8C7 13.5 6.2 13.2 5.5 12.5L3 10A1.061 1.061 0 0 1 4.5 8.5L5 9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHandFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 7 7.313 V 4 A 1 1 0 0 0 5 4 V 9 M 9 6.813 V 3 A 1 1 0 0 0 7 3 V 4 M 11 7.313 V 4 A 1 1 0 0 0 9 4 M 11 5.5 A 1 1 0 0 1 13 5.5 V 9.5 A 4 4 0 0 1 9 13.5 H 8 C 7 13.5 6.2 13.2 5.5 12.5 L 3 10 A 1.061 1.061 0 0 1 4.5 8.5 L 5 9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotHardDriveIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 7.5L3.724 4.053A1 1 0 0 1 4.618 3.5L11.382 3.5A1 1 0 0 1 12.276 4.053L14 7.5L14 11A1.5 1.5 0 0 1 12.5 12.5L3.5 12.5A1.5 1.5 0 0 1 2 11L2 7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 7.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11.5" cy="10" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotHardDriveFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 7.5L2 7.5H14L16 7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <circle cx="11.5" cy="10" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 7.5L3.724 4.053A1 1 0 0 1 4.618 3.5L11.382 3.5A1 1 0 0 1 12.276 4.053L14 7.5L14 11A1.5 1.5 0 0 1 12.5 12.5L3.5 12.5A1.5 1.5 0 0 1 2 11L2 7.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M2.5 12V8A5.5 5.5 0 0 1 13.5 8V12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotHighlighterIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 2V4A1.5 1.5 0 0 0 4.5 5.5H11.5A1.5 1.5 0 0 0 13 4V2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 5.5V7A1 1 0 0 0 5.5 8H10.5A1 1 0 0 0 11.5 7V5.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 8V14L10.5 11.5V8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotHighlighterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1 5.5H15M1 8H15" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3 2V4A1.5 1.5 0 0 0 4.5 5.5H11.5A1.5 1.5 0 0 0 13 4V2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 5.5V7A1 1 0 0 0 5.5 8H10.5A1 1 0 0 0 11.5 7V5.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 8V14L10.5 11.5V8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3.5 2H12.5M3.5 14H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotIdCardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="3" width="13" height="10" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.5" cy="7" r="1.5" fill="currentColor" />
    <path d="M3.5 13A2 2 0 0 1 7.5 13Z" fill="currentColor" />
    <path d="M9.25 5.5H12M9.25 8.5H12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotIdCardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="5.5" cy="7" r="1.5" fill="black" />
        <path d="M3.5 13A2 2 0 0 1 7.5 13Z" fill="black" />
        <path d="M9.25 5.5H12M9.25 8.5H12" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="1.5" y="3" width="13" height="10" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotImagesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 13.5L11.293 10.707A1 1 0 0 1 12.707 10.707L13.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.25" cy="8.25" r="0.75" fill="currentColor" />
    <path d="M2.5 8.5V4A1.5 1.5 0 0 1 4 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotImagesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M7.086 14.914L8.5 13.5L11.293 10.707A1 1 0 0 1 12.707 10.707L13.5 11.5L14.914 12.914" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <circle cx="8.25" cy="8.25" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2.5 8.5V4A1.5 1.5 0 0 1 4 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotIndentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 6L5 8L3 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 4H13.5M7.5 8H13.5M7.5 12H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotIndentFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.133 6.133 L 5 8 L 3.133 9.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7.688 4 H 13.313 M 7.688 8 H 13.313 M 7.688 12 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotKanbanIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2.5" width="12" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 5.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5.5V13.5M10 5.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotKanbanFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 5.5L2 5.5H14L16 5.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M6 5.5V15.5M10 5.5V15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="2.5" width="12" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M7.621 8.379L13.5 2.5M12.5 3.5L14 5M9.5 6.5L11 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotKeyboardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="3" width="13" height="10" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4.0625" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="6.6875" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="9.3125" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="11.9375" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="5.375" cy="8" r="0.75" fill="currentColor" />
    <circle cx="8" cy="8" r="0.75" fill="currentColor" />
    <circle cx="10.625" cy="8" r="0.75" fill="currentColor" />
    <path d="M4.5 10.5H11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotKeyboardFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="4.0625" cy="5.5" r="0.75" fill="black" />
        <circle cx="6.6875" cy="5.5" r="0.75" fill="black" />
        <circle cx="9.3125" cy="5.5" r="0.75" fill="black" />
        <circle cx="11.9375" cy="5.5" r="0.75" fill="black" />
        <circle cx="5.375" cy="8" r="0.75" fill="black" />
        <circle cx="8" cy="8" r="0.75" fill="black" />
        <circle cx="10.625" cy="8" r="0.75" fill="black" />
        <path d="M4.5 10.5H11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="1.5" y="3" width="13" height="10" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotLaptopIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 10L3 4.5A1.5 1.5 0 0 1 4.5 3L11.5 3A1.5 1.5 0 0 1 13 4.5L13 10L13.776 11.553A1 1 0 0 1 12.882 13L3.118 13A1 1 0 0 1 2.224 11.553L3 10Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 10H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLaptopFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1 10L3 10H13L15 10" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3 10L3 4.5A1.5 1.5 0 0 1 4.5 3L11.5 3A1.5 1.5 0 0 1 13 4.5L13 10L13.776 11.553A1 1 0 0 1 12.882 13L3.118 13A1 1 0 0 1 2.224 11.553L3 10Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3 8.559L8 11.059L13 8.559" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11.522L8 14.022L13 11.522" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLayoutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 6V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLayoutFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.5 6L2.5 6H13.5L15.5 6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M6.5 6V15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotLeafIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2.343L10.828 5.172A4 4 0 1 1 5.172 5.172Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLeafFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 6V12" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8 2.343L10.828 5.172A4 4 0 1 1 5.172 5.172Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M8 12V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLetterSpacingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 4.5V3.5H11V4.5M8 3.5V12.5M6.5 12.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLetterSpacingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 2.688 V 13.313 M 13.5 2.688 V 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5 4.313 V 3.5 H 11 V 4.313 M 8 3.5 V 12.5 M 6.688 12.5 H 9.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLibraryIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V13.5M5.5 4.5V13.5M8.5 3.5V13.5M11 4L13.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLibraryFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 2.688 V 13.313 M 5.5 4.688 V 13.313 M 8.5 3.688 V 13.313 M 11.048 4.181 L 13.452 13.319" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotLineIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 13.5L13.5 2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLineFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.633 13.367 L 13.367 2.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotLineHeightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5H13.5M2.5 13.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 6V5H11V6M8 5V11M6.5 11H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotLineHeightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 2.5 H 13.313 M 2.688 13.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5 5.813 V 5 H 11 V 5.813 M 8 5 V 11 M 6.688 11 H 9.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
    <circle cx="2.75" cy="5" r="0.75" fill="currentColor" />
    <circle cx="2.75" cy="8" r="0.75" fill="currentColor" />
    <circle cx="2.75" cy="11" r="0.75" fill="currentColor" />
    <path d="M6 5H13.5M6 8H13.5M6 11H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListBulletFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="2.75" cy="5" r="0.9375" fill="currentColor" />
      <circle cx="2.75" cy="8" r="0.9375" fill="currentColor" />
      <circle cx="2.75" cy="11" r="0.9375" fill="currentColor" />
      <path d="M 6.188 5 H 13.313 M 6.188 8 H 13.313 M 6.188 11 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotListChecklistIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 5L3.5 6.5L6.5 3.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11L3.5 12.5L6.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 5H13.5M9 8H13.5M9 11H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListChecklistFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.133 5.133 L 3.5 6.5 L 6.367 3.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.133 11.133 L 3.5 12.5 L 6.367 9.633" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.188 5 H 13.313 M 9.188 8 H 13.313 M 9.188 11 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotListNumberedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 4L4 3V6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.667 10A1.25 1 0 1 1 4.655 11.19L2.5 13H5.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 5H13.5M9 8H13.5M9 11H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotListNumberedFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.133 3.867 L 4 3 V 6.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.822 9.83 A 1.25 1 0 1 1 4.655 11.19 L 2.5 13 H 5.063" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.188 5 H 13.313 M 9.188 8 H 13.313 M 9.188 11 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5 7.5V5.5A3 3 0 0 1 11 5.5V7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotMagnetIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 2.5V8A5.5 5.5 0 0 0 13.5 8V2.5H10V8A2 2 0 0 1 6 8V2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5.5H6M10 5.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMagnetFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0 5.5H16" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.5 2.5V8A5.5 5.5 0 0 0 13.5 8V2.5H10V8A2 2 0 0 1 6 8V2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotMailOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.496 5.711L7.496 2.794A1 1 0 0 1 8.504 2.794L13.504 5.711A1 1 0 0 1 14 6.574L14 11.5A2 2 0 0 1 12 13.5L4 13.5A2 2 0 0 1 2 11.5L2 6.574A1 1 0 0 1 2.496 5.711Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 7.5L7.329 10.165A1.5 1.5 0 0 0 8.671 10.165L14 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMailOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.211 6.605L2 7.5L7.329 10.165A1.5 1.5 0 0 0 8.671 10.165L14 7.5L15.789 6.605" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2.496 5.711L7.496 2.794A1 1 0 0 1 8.504 2.794L13.504 5.711A1 1 0 0 1 14 6.574L14 11.5A2 2 0 0 1 12 13.5L4 13.5A2 2 0 0 1 2 11.5L2 6.574A1 1 0 0 1 2.496 5.711Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotMaskIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMaskFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="3" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M4.5 9.636V11.5A2 2 0 0 0 8.5 11.5V10.909" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3 7.5A5 5 0 0 0 13 7.5M8 12.5V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3 7.5A5 5 0 0 0 11.277 11.277M8 12.5L8 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotMountainIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.75 12C3.9 11.1 5.6 7.7 6.5 4H9.5C10.4 7.7 12.1 11.1 14.25 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.748 6.5L6.874 7.5L8 6.5L9.126 7.5L10.252 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMountainFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4.253 5.172L5.748 6.5L6.874 7.5L8 6.5L9.126 7.5L10.252 6.5L11.747 5.172" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M1.75 12C3.9 11.1 5.6 7.7 6.5 4H9.5C10.4 7.7 12.1 11.1 14.25 12Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotMouseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="4" y="1.5" width="8" height="13" rx="4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotMouseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 4V6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="4" y="1.5" width="8" height="13" rx="4" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M6 12V3.5L13.5 2V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotNewspaperIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 13H12A2 2 0 0 0 14 11V5A2 2 0 0 0 12 3H7A2 2 0 0 0 5 5V11.5A1.5 1.5 0 0 1 2 11.5V8A1 1 0 0 1 3 7H5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 5.5H11.5M7.5 8H11.5M7.5 10.5H11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotNewspaperFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 7V11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M7.5 5.5H11.5M7.5 8H11.5M7.5 10.5H11.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 13H12A2 2 0 0 0 14 11V5A2 2 0 0 0 12 3H7A2 2 0 0 0 5 5V7H3A1 1 0 0 0 2 8V11.5A1.5 1.5 0 0 0 3.5 13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotOptionIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4.5H5.5L10.5 11.5H13.5M9.5 4.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOptionFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 4.5 H 5.5 L 10.5 11.5 H 13.313 M 9.688 4.5 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M2 4.5H8.5M11.5 4.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11.5H4.5M7.5 11.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotOutdentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 6L2 8L4 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 4H13.5M7.5 8H13.5M7.5 12H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotOutdentFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.867 6.133 L 2 8 L 3.867 9.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 7.688 4 H 13.313 M 7.688 8 H 13.313 M 7.688 12 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M0 4L8 8L16 4M8 8V16M3.064 2.232L11.3 6.35" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
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
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPaddingAxisIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5.5V10.5M10.5 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPaddingAxisFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.5 5.688 V 10.313 M 10.5 5.688 V 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPaddingSideIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPaddingSideFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5.5 5.688 V 10.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPaintBucketIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.707 3.707L11.293 7.293A1 1 0 0 1 11.293 8.707L7.707 12.293A1 1 0 0 1 6.293 12.293L2.707 8.707A1 1 0 0 1 2.707 7.293L6.293 3.707A1 1 0 0 1 7.707 3.707ZM2.414 8H11.586" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3L6 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.753 10.304A0.225 0.225 0 0 1 13.097 10.304L14.071 11.457A1.5 1.5 0 1 1 11.779 11.457Z" fill="currentColor" />
  </svg>
);

export const PilotPaintBucketFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2 8L6.293 12.293A1 1 0 0 0 7.707 12.293L12 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.707 3.707L11.293 7.293A1 1 0 0 1 11.293 8.707L7.707 12.293A1 1 0 0 1 6.293 12.293L2.707 8.707A1 1 0 0 1 2.707 7.293L6.293 3.707A1 1 0 0 1 7.707 3.707ZM2.414 8H11.586" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3L6 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.753 10.304A0.225 0.225 0 0 1 13.097 10.304L14.071 11.457A1.5 1.5 0 1 1 11.779 11.457Z" fill="currentColor" />
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

export const PilotPaletteIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 14A6 6 0 0 1 8 2A6 5.5 0 0 1 14 7.5A3 3 0 0 1 11 10.5H10A1 1 0 0 0 9 11.5V12.5A1 1 0 0 1 8 14Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.75" cy="4.75" r="0.75" fill="currentColor" />
    <circle cx="11" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="4.75" cy="8.5" r="0.75" fill="currentColor" />
    <circle cx="5.5" cy="5.5" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotPaletteFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8.75" cy="4.75" r="0.75" fill="black" />
        <circle cx="11" cy="6.5" r="0.75" fill="black" />
        <circle cx="4.75" cy="8.5" r="0.75" fill="black" />
        <circle cx="5.5" cy="5.5" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8 14A6 6 0 0 1 8 2A6 5.5 0 0 1 14 7.5A3 3 0 0 1 11 10.5H10A1 1 0 0 0 9 11.5V12.5A1 1 0 0 1 8 14Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPanelBottomIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9.5V10.5A2 2 0 0 0 4 12.5H12A2 2 0 0 0 14 10.5V9.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelBottomFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2 9.5V10.5A2 2 0 0 0 4 12.5H12A2 2 0 0 0 14 10.5V9.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelLeftCloseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 6L9 8L11 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelLeftCloseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6L9 8L11 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPanelLeftOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6L11 8L9 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPanelLeftOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6L11 8L9 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPanelRightCloseIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6L9 8L11 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelRightCloseFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 6L9 8L11 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPanelRightOpenIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6L11 8L9 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelRightOpenFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M6.5 3.5H4A2 2 0 0 0 2 5.5V10.5A2 2 0 0 0 4 12.5H6.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 6L11 8L9 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPanelTopIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(1 0 0 -1 0 16)">
      <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9.5V10.5A2 2 0 0 0 4 12.5H12A2 2 0 0 0 14 10.5V9.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotPanelTopFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(1 0 0 -1 0 16)">
        <path d="M2 9.5V10.5A2 2 0 0 0 4 12.5H12A2 2 0 0 0 14 10.5V9.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPawIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 11.5A3.5 3.5 0 0 1 11.5 11.5A1 1 0 0 1 10.5 12.5H5.5A1 1 0 0 1 4.5 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="3" cy="7.5" r="1" fill="currentColor" />
    <circle cx="6" cy="4" r="1" fill="currentColor" />
    <circle cx="10" cy="4" r="1" fill="currentColor" />
    <circle cx="13" cy="7.5" r="1" fill="currentColor" />
  </svg>
);

export const PilotPawFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4.5 11.5A3.5 3.5 0 0 1 11.5 11.5A1 1 0 0 1 10.5 12.5H5.5A1 1 0 0 1 4.5 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3" cy="7.5" r="1" fill="currentColor" />
      <circle cx="6" cy="4" r="1" fill="currentColor" />
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="13" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
};

export const PilotPenToolIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 2H9.5L13 8L8 14L3 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14V9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="7.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPenToolFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 14V9" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="7.5" r="1.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.5 2H9.5L13 8L8 14L3 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8.845 2.878A2 2 0 0 1 12.5 4A2 2 0 0 1 9.736 5.848" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.981 9.178A3 3 0 0 1 10 9H11A3 3 0 0 1 14 12V12.5H11.154" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPercentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3" y="2.5" width="3" height="4" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="10" y="9.5" width="3" height="4" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 13.5L12 2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPercentFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="3" y="2.5" width="3" height="4" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="9.5" width="3" height="4" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13.5L12 2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M12 3.5V7.5M10 5.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPersonCheckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="5.5" cy="4.5" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 6.5L11 8L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonCheckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="5.5" cy="4.5" r="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 13V12.5A3 3 0 0 1 5 9.5H6A3 3 0 0 1 9 12.5V13Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 6.5L11 8L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPersonCircleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="6" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 12.873V12A2 2 0 0 1 6.5 10H9.5A2 2 0 0 1 11.5 12V12.873" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPersonCircleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="6" r="1.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 12.873V12A2 2 0 0 1 6.5 10H9.5A2 2 0 0 1 11.5 12V12.873" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M10 5.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPictureInPictureIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="8" y="7.5" width="3.5" height="2.5" rx="0.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPictureInPictureFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <rect x="8" y="7.5" width="3.5" height="2.5" rx="0.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPieChartIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V8H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPieChartFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 0L8 2V8H14L16 8" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPlaneIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 12.5L13.5 2.5M9 7L2.5 6M9 7L10 13.5M5 11L2.5 10.5M5 11L5.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPlaneFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3.633 12.367 L 13.367 2.633 M 9 7 L 2.685 6.029 M 9 7 L 9.971 13.315 M 5 11 L 2.684 10.537 M 5 11 L 5.463 13.316" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5.5 1.5V4.5M10.5 1.5V4.5M8 11.5V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotPolygonIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.895 2.837A1.25 1.25 0 0 1 9.105 2.837L13.779 11.665A1.25 1.25 0 0 1 12.674 13.5L3.326 13.5A1.25 1.25 0 0 1 2.221 11.665Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPolygonFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M6.895 2.837A1.25 1.25 0 0 1 9.105 2.837L13.779 11.665A1.25 1.25 0 0 1 12.674 13.5L3.326 13.5A1.25 1.25 0 0 1 2.221 11.665Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M4.5 5V2H11.5V5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotProhibitedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.757 3.757L12.243 12.243" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotProhibitedFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M3.757 3.757L12.243 12.243" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotPushpinIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 3A1 1 0 0 1 6 2H10A1 1 0 0 1 11 3V3.5A1 1 0 0 1 10 4.5A0.5 0.5 0 0 0 9.5 5V7C9.5 8.5 12.5 9 12.5 10.5A0.5 0.5 0 0 1 12 11H4A0.5 0.5 0 0 1 3.5 10.5C3.5 9 6.5 8.5 6.5 7V5A0.5 0.5 0 0 0 6 4.5A1 1 0 0 1 5 3.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPushpinFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 3A1 1 0 0 1 6 2H10A1 1 0 0 1 11 3V3.5A1 1 0 0 1 10 4.5A0.5 0.5 0 0 0 9.5 5V7C9.5 8.5 12.5 9 12.5 10.5A0.5 0.5 0 0 1 12 11H4A0.5 0.5 0 0 1 3.5 10.5C3.5 9 6.5 8.5 6.5 7V5A0.5 0.5 0 0 0 6 4.5A1 1 0 0 1 5 3.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotPuzzleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 5A1 1 0 0 1 5 4H7.5V3.5A1.5 1.5 0 0 1 10.5 3.5V4H13A1 1 0 0 1 14 5V7A2 2 0 0 0 14 11V13A1 1 0 0 1 13 14H11A2 2 0 0 0 7 14H5A1 1 0 0 1 4 13V10.5H3.5A1.5 1.5 0 0 1 3.5 7.5H4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotPuzzleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M4 5A1 1 0 0 1 5 4H7.5V3.5A1.5 1.5 0 0 1 10.5 3.5V4H13A1 1 0 0 1 14 5V7A2 2 0 0 0 14 11V13A1 1 0 0 1 13 14H11A2 2 0 0 0 7 14H5A1 1 0 0 1 4 13V10.5H3.5A1.5 1.5 0 0 1 3.5 7.5H4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotQrCodeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="1.5" y="1.5" width="5" height="5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="4" r="0.75" fill="currentColor" />
    <circle cx="12" cy="4" r="0.75" fill="currentColor" />
    <circle cx="4" cy="12" r="0.75" fill="currentColor" />
    <circle cx="10" cy="10" r="1" fill="currentColor" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const PilotQrCodeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="4" cy="4" r="0.75" fill="black" />
        <circle cx="12" cy="4" r="0.75" fill="black" />
        <circle cx="4" cy="12" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="1.5" y="1.5" width="5" height="5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
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

export const PilotRecordIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="2.5" fill="currentColor" />
  </svg>
);

export const PilotRecordFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="2.5" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotRectangleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRectangleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotRemoveCircleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRemoveCircleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 8H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotRepeatIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.211 9.197A3.5 3.5 0 0 1 5.5 4.5H12.5M10 2L12.5 4.5L10 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.789 6.803A3.5 3.5 0 0 1 10.5 11.5H3.5M6 9L3.5 11.5L6 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotRepeatFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.145 8.998 A 3.5 3.5 0 0 1 5.5 4.5 H 12.5 M 10.133 2.133 L 12.5 4.5 L 10.133 6.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13.855 7.002 A 3.5 3.5 0 0 1 10.5 11.5 H 3.5 M 5.867 9.133 L 3.5 11.5 L 5.867 13.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotReplyIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5L2.5 5.5L5.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5.5H9A4.5 4.5 0 0 1 13.5 10V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotReplyFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.367 2.633 L 2.5 5.5 L 5.367 8.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.5 5.5 H 9 A 4.5 4.5 0 0 1 13.5 10 V 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotReplyAllIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5L2.5 5.5L5.5 8.5M9.5 2.5L6.5 5.5L9.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 5.5H9A4.5 4.5 0 0 1 13.5 10V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotReplyAllFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.367 2.633 L 2.5 5.5 L 5.367 8.367 M 9.367 2.633 L 6.5 5.5 L 9.367 8.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.5 5.5 H 9 A 4.5 4.5 0 0 1 13.5 10 V 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotRewindIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M4.207 4.207L7.47 7.47A0.75 0.75 0 0 1 7.47 8.53L4.207 11.793A1 1 0 0 1 2.5 11.086L2.5 4.914A1 1 0 0 1 4.207 4.207Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.707 4.207L12.97 7.47A0.75 0.75 0 0 1 12.97 8.53L9.707 11.793A1 1 0 0 1 8 11.086L8 4.914A1 1 0 0 1 9.707 4.207Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotRewindFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M4.207 4.207L7.47 7.47A0.75 0.75 0 0 1 7.47 8.53L4.207 11.793A1 1 0 0 1 2.5 11.086L2.5 4.914A1 1 0 0 1 4.207 4.207Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.707 4.207L12.97 7.47A0.75 0.75 0 0 1 12.97 8.53L9.707 11.793A1 1 0 0 1 8 11.086L8 4.914A1 1 0 0 1 9.707 4.207Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M4.995 11.005L3.227 12.773M6.586 12.596L5.525 13.657M3.404 9.414L2.343 10.475" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M12.665 11.08A5.59 5.59 0 1 1 13 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3.25V5.5H10.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotRowsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(0 1 1 0 0 0)">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotRowsFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(0 1 1 0 0 0)">
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
          <rect width="16" height="16" fill="white" />
          <path d="M8 0.5L8 2.5V13.5L8 15.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        </mask>
        <g mask={`url(#${id})`}>
          <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
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

export const PilotScreenShareIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V13.5M5.5 13.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8.5V5M5.5 7.5L8 5L10.5 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotScreenShareFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 8.5V5M5.5 7.5L8 5L10.5 7.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M8 11V13.5M5.5 13.5H10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSearchIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M12 7A5 5 0 1 1 2 7A5 5 0 1 1 12 7Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSearchFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M12 7A5 5 0 1 1 2 7A5 5 0 1 1 12 7Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotShadowIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 5.064A2 2 0 0 1 14 7V12A2 2 0 0 1 12 14H7A2 2 0 0 1 5.064 12.5H9A3.5 3.5 0 0 0 12.5 9Z" fill="currentColor" />
  </svg>
);

export const PilotShadowFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="8" height="8" rx="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 5.064A2 2 0 0 1 14 7V12A2 2 0 0 1 12 14H7A2 2 0 0 1 5.064 12.5H9A3.5 3.5 0 0 0 12.5 9Z" fill="currentColor" />
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
      <path d="M9.031 4.25A3.5 3.5 0 1 0 4.25 9.031" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotShieldCheckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M13.5 8.5C13.5 11.8 10.97 13.5 8.22 14.4A0.6 0.6 0 0 1 7.78 14.4C5.03 13.5 2.5 11.8 2.5 8.5V4.2A0.7 0.7 0 0 1 3.27 3.5C4.7 3.5 6.46 2.7 7.56 1.8A0.6 0.6 0 0 1 8.44 1.8C9.54 2.7 11.3 3.5 12.73 3.5A0.7 0.7 0 0 1 13.5 4.2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8L7 10L11 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShieldCheckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 8L7 10L11 6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M13.5 8.5C13.5 11.8 10.97 13.5 8.22 14.4A0.6 0.6 0 0 1 7.78 14.4C5.03 13.5 2.5 11.8 2.5 8.5V4.2A0.7 0.7 0 0 1 3.27 3.5C4.7 3.5 6.46 2.7 7.56 1.8A0.6 0.6 0 0 1 8.44 1.8C9.54 2.7 11.3 3.5 12.73 3.5A0.7 0.7 0 0 1 13.5 4.2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotShiftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8.707 2.707L12.72 6.72A0.75 0.75 0 0 1 12.189 8L11 8A0.5 0.5 0 0 0 10.5 8.5L10.5 12.5A1 1 0 0 1 9.5 13.5L6.5 13.5A1 1 0 0 1 5.5 12.5L5.5 8.5A0.5 0.5 0 0 0 5 8L3.811 8A0.75 0.75 0 0 1 3.28 6.72L7.293 2.707A1 1 0 0 1 8.707 2.707Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShiftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M8.707 2.707L12.72 6.72A0.75 0.75 0 0 1 12.189 8L11 8A0.5 0.5 0 0 0 10.5 8.5L10.5 12.5A1 1 0 0 1 9.5 13.5L6.5 13.5A1 1 0 0 1 5.5 12.5L5.5 8.5A0.5 0.5 0 0 0 5 8L3.811 8A0.75 0.75 0 0 1 3.28 6.72L7.293 2.707A1 1 0 0 1 8.707 2.707Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotShuffleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 11.5H3.5C6 11.5 7.5 4.5 10 4.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 4.5L3.5 4.5C4.195 4.5 4.814 5.042 5.4 5.825M8.101 10.174C8.685 10.957 9.304 11.5 10 11.5L13.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 2.5L13.5 4.5L11.5 6.5M11.5 9.5L13.5 11.5L11.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotShuffleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 11.5 H 3.5 C 6 11.5 7.5 4.5 10 4.5 H 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.633 2.633 L 13.5 4.5 L 11.633 6.367 M 11.633 9.633 L 13.5 11.5 L 11.633 13.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 4.5L3.5 4.5C4.132 4.5 4.7 4.947 5.235 5.615M8.265 10.386C8.801 11.053 9.369 11.5 10 11.5L13.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSidesIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5H10.5M13.5 5.5V10.5M10.5 13.5H5.5M2.5 10.5V5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSidesFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.688 2.5 H 10.313 M 13.5 5.688 V 10.313 M 10.313 13.5 H 5.688 M 2.5 10.313 V 5.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSigmaIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.5 4.5L11.5 3.5A1 1 0 0 0 10.5 2.5L5.964 2.5A1 1 0 0 0 5.155 4.088L7.679 7.559A0.75 0.75 0 0 1 7.679 8.441L5.155 11.912A1 1 0 0 0 5.964 13.5L10.5 13.5A1 1 0 0 0 11.5 12.5L11.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSigmaFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 11.5 4.313 L 11.5 3.5 A 1 1 0 0 0 10.5 2.5 L 5.964 2.5 A 1 1 0 0 0 5.155 4.088 L 7.679 7.559 A 0.75 0.75 0 0 1 7.679 8.441 L 5.155 11.912 A 1 1 0 0 0 5.964 13.5 L 10.5 13.5 A 1 1 0 0 0 11.5 12.5 L 11.5 11.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M13.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M2 4.5H8.5M11.5 4.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11.5H4.5M7.5 11.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSmileIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="6" r="0.75" fill="currentColor" />
    <circle cx="10" cy="6" r="0.75" fill="currentColor" />
    <path d="M5.25 9A3 3 0 0 0 10.75 9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSmileFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="6" cy="6" r="0.75" fill="black" />
        <circle cx="10" cy="6" r="0.75" fill="black" />
        <path d="M5.25 9A3 3 0 0 0 10.75 9" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSnowflakeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 2L8 14M13.196 5L2.804 11M13.196 11L2.804 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.75 2.5L8 4.25L6.25 2.5M13.638 6.766L11.248 6.125L11.888 3.734M11.888 12.266L11.248 9.875L13.638 9.234M6.25 13.5L8 11.75L9.75 13.5M2.362 9.234L4.752 9.875L4.112 12.266M4.112 3.734L4.752 6.125L2.362 6.766" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSnowflakeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 8 2.188 L 8 13.813 M 13.034 5.094 L 2.966 10.906 M 13.034 10.906 L 2.966 5.094" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.617 2.633 L 8 4.25 L 6.383 2.633 M 13.457 6.717 L 11.248 6.125 L 11.84 3.915 M 11.84 12.085 L 11.248 9.875 L 13.457 9.283 M 6.383 13.367 L 8 11.75 L 9.617 13.367 M 2.543 9.283 L 4.752 9.875 L 4.16 12.085 M 4.16 3.915 L 4.752 6.125 L 2.543 6.717" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotSortAscendingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.5 12.5V3.5M9 6L11.5 3.5L14 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6.5H5.5M2 9.5H7M2 12.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSortAscendingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 11.5 12.313 V 3.5 M 9.133 5.867 L 11.5 3.5 L 13.867 5.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.188 6.5 H 5.313 M 2.188 9.5 H 6.813 M 2.188 12.5 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSortDescendingIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(1 0 0 -1 0 16)">
      <path d="M11.5 12.5V3.5M9 6L11.5 3.5L14 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 6.5H5.5M2 9.5H7M2 12.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotSortDescendingFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(1 0 0 -1 0 16)">
        <path d="M 11.5 12.313 V 3.5 M 9.133 5.867 L 11.5 3.5 L 13.867 5.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2.188 6.5 H 5.313 M 2.188 9.5 H 6.813 M 2.188 12.5 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotSpeakerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="3.5" y="1.5" width="9" height="13" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10" r="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="4.75" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotSpeakerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="10" r="2" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="4.75" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="3.5" y="1.5" width="9" height="13" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotSplineIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="12.5" cy="3.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="3.5" cy="12.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 11A7.5 7.5 0 0 1 11 3.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSplineFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <circle cx="12.5" cy="3.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3.5" cy="12.5" r="1.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 11A7.5 7.5 0 0 1 11 3.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotStarOffIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.884 3.702L7.327 2.805A0.75 0.75 0 0 1 8.673 2.805L10.073 5.642A0.25 0.25 0 0 0 10.261 5.779L13.391 6.233A0.75 0.75 0 0 1 13.807 7.513L12.231 9.049M11.786 11.786L12.005 13.06A0.75 0.75 0 0 1 10.916 13.851L8.116 12.378A0.25 0.25 0 0 0 7.884 12.378L5.084 13.851A0.75 0.75 0 0 1 3.995 13.06L4.53 9.942A0.25 0.25 0 0 0 4.458 9.721L2.193 7.513A0.75 0.75 0 0 1 2.609 6.233L5.739 5.779A0.25 0.25 0 0 0 5.772 5.772" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStarOffFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M8.673 2.805L10.073 5.642A0.25 0.25 0 0 0 10.261 5.779L13.391 6.233A0.75 0.75 0 0 1 13.807 7.513L11.542 9.721A0.25 0.25 0 0 0 11.47 9.942L12.005 13.06A0.75 0.75 0 0 1 10.916 13.851L8.116 12.378A0.25 0.25 0 0 0 7.884 12.378L5.084 13.851A0.75 0.75 0 0 1 3.995 13.06L4.53 9.942A0.25 0.25 0 0 0 4.458 9.721L2.193 7.513A0.75 0.75 0 0 1 2.609 6.233L5.739 5.779A0.25 0.25 0 0 0 5.927 5.642L7.327 2.805A0.75 0.75 0 0 1 8.673 2.805Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotStopCircleIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" />
  </svg>
);

export const PilotStopCircleFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <rect x="6" y="6" width="4" height="4" rx="1" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotStoreIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 2.5H13A1 1 0 0 1 14 3.5V5.5A2 2 0 0 1 10 5.5A2 2 0 0 1 6 5.5A2 2 0 0 1 2 5.5V3.5A1 1 0 0 1 3 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 7.232V12A1.5 1.5 0 0 0 4.5 13.5H11.5A1.5 1.5 0 0 0 13 12V7.232" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 13.5V11A1 1 0 0 1 7.5 10H8.5A1 1 0 0 1 9.5 11V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStoreFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M3 2.5H13A1 1 0 0 1 14 3.5V5.5A2 2 0 0 1 10 5.5A2 2 0 0 1 6 5.5A2 2 0 0 1 2 5.5V3.5A1 1 0 0 1 3 2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 7.232V12A1.5 1.5 0 0 0 4.5 13.5H11.5A1.5 1.5 0 0 0 13 12V7.232" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 13.5V11A1 1 0 0 1 7.5 10H8.5A1 1 0 0 1 9.5 11V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStrikethroughIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.031 3.875A3.5 2.75 0 0 0 4.514 5.5M8 8A3.5 2.75 0 1 1 4.969 12.125" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStrikethroughFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 10.872 3.678 A 3.5 2.75 0 0 0 4.5 5.267 M 8 8 A 3.5 2.75 0 1 1 5.09 12.278" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3.188 8 H 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotStrokeWeightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2.5" y="2.5" width="11" height="1" rx="0.5" fill="currentColor" />
    <rect x="2.5" y="6" width="11" height="2" rx="1" fill="currentColor" />
    <rect x="2.5" y="10.5" width="11" height="3" rx="1.5" fill="currentColor" />
  </svg>
);

export const PilotStrokeWeightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2.5" y="2.5" width="11" height="1" rx="0.5" fill="currentColor" />
      <rect x="2.5" y="6" width="11" height="2" rx="1" fill="currentColor" />
      <rect x="2.5" y="10.5" width="11" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
};

export const PilotSubscriptIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4.5L8.5 10.5M8.5 4.5L2.5 10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.167 11A1.25 1 0 1 1 13.155 12.19L11 14H13.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSubscriptFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.633 4.633 L 8.367 10.367 M 8.367 4.633 L 2.633 10.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.322 10.83 A 1.25 1 0 1 1 13.155 12.19 L 11 14 H 13.563" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSubtractIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 8H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSubtractFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 8 H 13.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8 2V3M8 13V14M2 8H3M13 8H14M3.757 3.757L4.464 4.464M12.243 12.243L11.536 11.536M12.243 3.757L11.536 4.464M3.757 12.243L4.464 11.536" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSuperscriptIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 5.5L8.5 11.5M8.5 5.5L2.5 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.167 3A1.25 1 0 1 1 13.155 4.19L11 6H13.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSuperscriptFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.633 5.633 L 8.367 11.367 M 8.367 5.633 L 2.633 11.367" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 11.322 2.83 A 1.25 1 0 1 1 13.155 4.19 L 11 6 H 13.563" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotSyncIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 2.5V5.5H6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5.5A5.59 5.59 0 0 1 13.59 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 13.5V10.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 10.5A5.59 5.59 0 0 1 2.41 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSyncFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 3 2.688 V 5.5 H 5.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 3 5.5 A 5.59 5.59 0 0 1 13.585 7.766" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13 13.313 V 10.5 H 10.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 13 10.5 A 5.59 5.59 0 0 1 2.415 8.234" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotTabletIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 10H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTabletFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 10H9.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTagIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 2.5L7.086 2.5A1 1 0 0 1 7.793 2.793L12.939 7.939A1.5 1.5 0 0 1 12.939 10.061L9.707 13.293A1 1 0 0 1 8.293 13.293L2.793 7.793A1 1 0 0 1 2.5 7.086L2.5 4.5A2 2 0 0 1 4.5 2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.75" cy="5.75" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotTagFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="5.75" cy="5.75" r="0.75" fill="black" />
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

export const PilotTextAlignCenterIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4 4H12M2.5 8H13.5M5 12H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextAlignCenterFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.188 4 H 11.813 M 2.688 8 H 13.313 M 5.188 12 H 10.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTextAlignLeftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4H10.5M2.5 8H13.5M2.5 12H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextAlignLeftFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.688 4 H 10.313 M 2.688 8 H 13.313 M 2.688 12 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTextAlignRightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(-1 0 0 1 16 0)">
      <path d="M2.5 4H10.5M2.5 8H13.5M2.5 12H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotTextAlignRightFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(-1 0 0 1 16 0)">
        <path d="M 2.688 4 H 10.313 M 2.688 8 H 13.313 M 2.688 12 H 8.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTextCursorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 2H5.5A2.5 2.5 0 0 1 8 4.5V11.5A2.5 2.5 0 0 1 5.5 14H5M11 2H10.5A2.5 2.5 0 0 0 8 4.5M11 14H10.5A2.5 2.5 0 0 1 8 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextCursorFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.188 2 H 5.5 A 2.5 2.5 0 0 1 8 4.5 V 11.5 A 2.5 2.5 0 0 1 5.5 14 H 5.188 M 10.813 2 H 10.5 A 2.5 2.5 0 0 0 8 4.5 M 10.813 14 H 10.5 A 2.5 2.5 0 0 1 8 11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTextSizeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 4.5V2.5H9.5V4.5M6 2.5V13.5M4 13.5H8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 8.5V7.5H13.5V8.5M12 7.5V13.5M11 13.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTextSizeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.5 4.313 V 2.5 H 9.5 V 4.313 M 6 2.5 V 13.5 M 4.188 13.5 H 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.5 8.313 V 7.5 H 13.5 V 8.313 M 12 7.5 V 13.5 M 11.188 13.5 H 12.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotThermometerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 8.4V4A1.5 1.5 0 0 1 9.5 4V8.4A3 3 0 1 1 6.5 8.4Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11" r="1" fill="currentColor" />
  </svg>
);

export const PilotThermometerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="11" r="1" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.5 8.4V4A1.5 1.5 0 0 1 9.5 4V8.4A3 3 0 1 1 6.5 8.4Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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

export const PilotTicketIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 3.5H12.5A1.5 1.5 0 0 1 14 5V6.5A1.5 1.5 0 0 0 14 9.5V11A1.5 1.5 0 0 1 12.5 12.5H3.5A1.5 1.5 0 0 1 2 11V9.5A1.5 1.5 0 0 0 2 6.5V5A1.5 1.5 0 0 1 3.5 3.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 3.5V5M9.5 7.25V8.75M9.5 11V12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTicketFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M9.5 3.5V5M9.5 7.25V8.75M9.5 11V12.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 3.5H12.5A1.5 1.5 0 0 1 14 5V6.5A1.5 1.5 0 0 0 14 9.5V11A1.5 1.5 0 0 1 12.5 12.5H3.5A1.5 1.5 0 0 1 2 11V9.5A1.5 1.5 0 0 0 2 6.5V5A1.5 1.5 0 0 1 3.5 3.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTimerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <circle cx="8" cy="9" r="5.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 3.5V1.5M6.5 1.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.889 5.111L13 4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9V6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTimerFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 9V6" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="9" r="5.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M8 3.5V1.5M6.5 1.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.889 5.111L13 4" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotTranslateIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 4.5H8M5.5 2.5V4.5M3.5 6.5L7 10M3 10L6.5 6.5L7.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.25 13.5L10.293 7.878A0.75 0.75 0 0 1 11.707 7.878L13.75 13.5M9.1 11.5H12.9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTranslateFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2.188 4.5 H 7.813 M 5.5 2.688 V 4.5 M 3.633 6.633 L 6.867 9.867 M 3.133 9.867 L 6.5 6.5 L 7.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 8.314 13.324 L 10.293 7.878 A 0.75 0.75 0 0 1 11.707 7.878 L 13.686 13.324 M 9.1 11.5 H 12.9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3 4.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 4.5V2.5A1 1 0 0 1 7.5 1.5H8.5A1 1 0 0 1 9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTreeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 11A2.5 2.5 0 1 1 5.174 6.006A3 3 0 1 1 10.826 6.006A2.5 2.5 0 1 1 11 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTreeFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M5 11A2.5 2.5 0 1 1 5.174 6.006A3 3 0 1 1 10.826 6.006A2.5 2.5 0 1 1 11 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTrendingDownIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <g transform="matrix(1 0 0 -1 0 16)">
      <path d="M2 11L6 7L9 10L14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 5H14V8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const PilotTrendingDownFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <g transform="matrix(1 0 0 -1 0 16)">
        <path d="M 2.133 10.867 L 6 7 L 9 10 L 14 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 11.188 5 H 14 V 7.813" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
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
      <path d="M5 3.5H3A1 1 0 0 0 2 4.5V5A2 2 0 0 0 4 7H5.402M11 3.5H13A1 1 0 0 1 14 4.5V5A2 2 0 0 1 12 7H10.598" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8.5V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTruckIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 11.5H2.5A1 1 0 0 1 1.5 10.5V5A1.5 1.5 0 0 1 3 3.5H7A1.5 1.5 0 0 1 8.5 5V11.5M1.5 8H8.5M6 11.5H8.5M8.5 5H11.5A2.5 2.5 0 0 1 14 7.5V11A0.5 0.5 0 0 1 13.5 11.5H11.5M11 5V7.5H14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4.5" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTruckFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M4 11.5A0.5 0.5 0 1 1 5 11.5A0.5 0.5 0 1 1 4 11.5ZM9.5 11.5A0.5 0.5 0 1 1 10.5 11.5A0.5 0.5 0 1 1 9.5 11.5Z" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M1.5 10.5V5A1.5 1.5 0 0 1 3 3.5H7A1.5 1.5 0 0 1 8.5 5H11.5A2.5 2.5 0 0 1 14 7.5V11A0.5 0.5 0 0 1 13.5 11.5H2.5A1 1 0 0 1 1.5 10.5ZM11 5V7.5H14A2.5 2.5 0 0 0 11.5 5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="4.5" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="11.5" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotTvIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 13.5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTvFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="2" y="2.5" width="12" height="8.5" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13.5H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUmbrellaIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 8.5A5.5 5.5 0 0 1 13.5 8.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V3M8 8.5V12.5A1.5 1.5 0 0 1 5 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUmbrellaFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M2.5 8.5A5.5 5.5 0 0 1 13.5 8.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2V3M8 8.5V12.5A1.5 1.5 0 0 1 5 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5 7.5V5.5A3 3 0 0 1 10.719 4.232" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotUnpinIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.222 2.04A1 1 0 0 1 5.5 2L9.5 2A1 1 0 0 1 10.5 3L10.5 3.5A1 1 0 0 1 9.5 4.5A0.5 0.5 0 0 0 9 5L9 5.818M11 11L3.5 11A0.5 0.5 0 0 1 3 10.5C3 9 6 8.5 6 7L6 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 11V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotUnpinFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M0.928 -0.928L16.928 15.072" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 3A1 1 0 0 1 5.5 2L9.5 2A1 1 0 0 1 10.5 3L10.5 3.5A1 1 0 0 1 9.5 4.5A0.5 0.5 0 0 0 9 5L9 7C9 8.5 12 9 12 10.5A0.5 0.5 0 0 1 11.5 11L3.5 11A0.5 0.5 0 0 1 3 10.5C3 9 6 8.5 6 7L6 5A0.5 0.5 0 0 0 5.5 4.5A1 1 0 0 1 4.5 3.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M7.5 11V14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotVariableIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 2.5A6.542 6.542 0 0 0 5.5 13.5M10.5 2.5A6.542 6.542 0 0 1 10.5 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L10 10M10 6L6 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotVariableFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 5.33 2.613 A 6.542 6.542 0 0 0 5.33 13.387 M 10.67 2.613 A 6.542 6.542 0 0 1 10.67 13.387" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6.133 6.133 L 9.867 9.867 M 9.867 6.133 L 6.133 9.867" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M2 2L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M10.5 5.5A3.5 3.5 0 0 1 10.5 10.5M12 3.5A6.364 6.364 0 0 1 12 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M10.5 6.25L14 9.75M14 6.25L10.5 9.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotWalletIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3H11A1.5 1.5 0 0 1 12.5 4.5V6A1.5 1.5 0 0 1 14 7.5V11.5A1.5 1.5 0 0 1 12.5 13H4A2 2 0 0 1 2 11Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 4.5A1.5 1.5 0 0 0 3.5 6H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10H11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWalletFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M10.5 10H11" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 6H12.5" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3H11A1.5 1.5 0 0 1 12.5 4.5V6A1.5 1.5 0 0 1 14 7.5V11.5A1.5 1.5 0 0 1 12.5 13H4A2 2 0 0 1 2 11Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotWandIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M11.25 2Q11.58 4.42 14 4.75Q11.58 5.08 11.25 7.5Q10.92 5.08 8.5 4.75Q10.92 4.42 11.25 2Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 14L7.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWandFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M11.25 2Q11.58 4.42 14 4.75Q11.58 5.08 11.25 7.5Q10.92 5.08 8.5 4.75Q10.92 4.42 11.25 2Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14L7.5 8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotWatchIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="4" y="4.5" width="8" height="7" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 4.5V2.5A1 1 0 0 1 6.5 1.5H9.5A1 1 0 0 1 10.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 11.5V13.5A1 1 0 0 0 6.5 14.5H9.5A1 1 0 0 0 10.5 13.5V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWatchFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M3 3.375H13" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M3 12.625H13" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter" />
      </mask>
      <g mask={`url(#${id})`}>
        <rect x="4" y="4.5" width="8" height="7" rx="2" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 4.5V2.5A1 1 0 0 1 6.5 1.5H9.5A1 1 0 0 1 10.5 2.5V4.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 11.5V13.5A1 1 0 0 0 6.5 14.5H9.5A1 1 0 0 0 10.5 13.5V11.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotWaveformIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 6.5V9.5M5 4V12M8 2V14M11 5V11M14 6.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWaveformFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 2 6.688 V 9.313 M 5 4.188 V 11.813 M 8 2.188 V 13.813 M 11 5.188 V 10.813 M 14 6.688 V 9.313" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
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

export const PilotWindIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.606 3.151A1.75 1.75 0 1 1 6.25 5.5H2.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.106 5.651A1.75 1.75 0 1 1 11.75 8H5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 10.5H10.25A1.75 1.75 0 1 1 8.606 12.849" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotWindFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <path d="M 4.703 2.933 A 1.75 1.75 0 1 1 6.25 5.5 H 2.688" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10.203 5.433 A 1.75 1.75 0 1 1 11.75 8 H 5.188" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 2.688 10.5 H 10.25 A 1.75 1.75 0 1 1 8.703 13.067" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size, 1.3333) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotZoomFitIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="6" y="6" width="4" height="4" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3.5L8 2L9.5 3.5M6.5 12.5L8 14L9.5 12.5M3.5 6.5L2 8L3.5 9.5M12.5 6.5L14 8L12.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotZoomFitFilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 3.5L8 2L9.5 3.5M6.5 12.5L8 14L9.5 12.5M3.5 6.5L2 8L3.5 9.5M12.5 6.5L14 8L12.5 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M7 5V9M5 7H9" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="7" cy="7" r="5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
  const id = useMaskId();
  return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 7H9" fill="none" stroke="black" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="7" cy="7" r="5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = [{"id":"batch-1","title":"Batch 1 · Core","icons":{"add":"approved","arrow-up":"approved","bell":"review","check":"approved","chevron-down":"approved","copy":"approved","dismiss":"approved","document":"approved","eye":"approved","folder":"approved","info":"approved","link":"approved","more-horizontal":"approved","open":"approved","person":"approved","reset":"approved","search":"approved","settings":"approved","status-available":"approved","trash":"approved","warning":"approved"}},{"id":"batch-2","title":"Batch 2 · Alignment","icons":{"align-left":"approved","align-center":"approved"}},{"id":"batch-3","title":"Batch 3 · Docs chrome","icons":{"expand":"approved","panel-left":"approved","book":"approved","options":"approved","color":"approved","text":"approved","shapes":"approved","list":"approved","square-dashed":"approved","layers":"approved","flash":"approved"}},{"id":"batch-4","title":"Batch 4 · Inspector","icons":{"angle":"approved","aspect-ratio":"approved","auto-layout":"approved","corner":"approved","corners":"approved","dots-four":"approved","eye-off":"approved","flip":"approved","flow":"approved","flow-wrap":"approved","flow-free":"approved","gap":"approved","opacity":"approved","padding":"approved","padding-sides":"approved","token":"approved","rotate":"approved"}},{"id":"batch-5","title":"Batch 5 · Common","icons":{"lock":"approved","star":"approved","heart":"approved","calendar":"approved","clock":"approved","pencil":"approved","download":"approved","upload":"approved","filter":"approved","sort":"approved","sparkle":"approved","pin":"approved"}},{"id":"batch-6","title":"Batch 6 · Everyday","icons":{"minus":"approved","send":"approved","home":"approved","mail":"approved","chat":"approved","image":"approved","mic":"approved","help":"approved","bookmark":"approved"}},{"id":"batch-7","title":"Batch 7 · Controls & system","icons":{"menu":"approved","grid":"approved","play":"approved","pause":"approved","undo":"approved","sun":"approved","moon":"approved","desktop":"approved","code":"approved","terminal":"approved","error":"approved","unlock":"approved","share":"approved","globe":"approved"}},{"id":"batch-8","title":"Batch 8 · Objects","icons":{"attach":"approved","tag":"review","people":"approved","zoom-in":"review","zoom-out":"review","flag":"approved","archive":"approved","cloud":"approved","phone":"approved","camera":"approved","cart":"approved"}},{"id":"batch-9","title":"Batch 9 · Text & objects","icons":{"bold":"approved","italic":"approved","underline":"approved","quote":"approved","hash":"approved","at":"approved","key":"approved","shield":"approved","gift":"approved","map":"approved","chart":"approved","table":"approved"}},{"id":"batch-10","title":"Batch 10 · Editing & devices","icons":{"strikethrough":"approved","heading":"approved","list-bullet":"review","wifi":"approved","bluetooth":"approved","battery":"approved","plug":"approved","power":"approved","printer":"approved","headphones":"approved","video":"approved","inbox":"approved"}},{"id":"batch-11","title":"Batch 11 · Everyday objects","icons":{"thumbs-up":"approved","smile":"review","briefcase":"approved","building":"review","compass":"approved","crop":"approved","trophy":"approved","coffee":"approved"}},{"id":"batch-12","title":"Batch 12 · System & tools","icons":{"database":"approved","server":"approved","scissors":"approved","log-in":"approved","log-out":"approved","keyboard":"review","pointer":"approved","move":"review","hourglass":"approved","loader":"approved"}},{"id":"batch-13","title":"Batch 13 · Media & commerce","icons":{"volume":"approved","volume-off":"approved","music":"approved","film":"approved","credit-card":"approved","wallet":"review","receipt":"approved","lightbulb":"approved","megaphone":"approved"}},{"id":"batch-14","title":"Batch 14 · Tools & actions","icons":{"person-add":"review","history":"approved","save":"approved","bug":"review","eyedropper":"approved","paintbrush":"review","puzzle":"review","ruler":"approved"}},{"id":"batch-15","title":"Batch 15 · Off states & objects","icons":{"bell-off":"review","mic-off":"review","video-off":"review","calculator":"review","graduation-cap":"review","car":"review","package":"review"}},{"id":"batch-16","title":"Batch 16 · Keys & connections","icons":{"wifi-off":"review","link-off":"review","cloud-upload":"review","command":"review","return":"review","backspace":"review","rocket":"review"}},{"id":"batch-17","title":"Batch 17 · Media & everyday","icons":{"skip-forward":"review","stop":"review","repeat":"review","person-remove":"review","clipboard":"review","sticky-note":"review","trending-up":"review","shopping-bag":"review"}},{"id":"batch-18","title":"Batch 18 · Add, sync & sensing","icons":{"calendar-add":"review","folder-add":"review","document-add":"review","cloud-download":"review","shuffle":"review","fingerprint":"review","gauge":"review"}},{"id":"batch-19","title":"Batch 19 · Open, add & devices","icons":{"chat-add":"review","cloud-off":"review","folder-open":"review","mail-open":"review","timer":"review","laptop":"review"}},{"id":"batch-20","title":"Batch 20 · Devices","icons":{"tablet":"review","tv":"review","watch":"review","mouse":"review","speaker":"review","hard-drive":"review","chip":"review"}},{"id":"batch-21","title":"Batch 21 · Checks & charts","icons":{"calendar-check":"review","document-check":"review","person-check":"review","shield-check":"review","bar-chart":"review","pie-chart":"review"}},{"id":"batch-22","title":"Batch 22 · Everyday UI","icons":{"add-circle":"review","remove-circle":"review","prohibited":"review","chevrons-up-down":"review","collapse":"review","alarm":"review","git-branch":"review","grip-vertical":"review","activity":"review","layout":"review","percent":"review"}},{"id":"batch-23","title":"Batch 23 · Communication & text","icons":{"call":"review","reply":"review","sync":"review","eraser":"review","text-align-left":"review","text-align-center":"review","indent":"review","outdent":"review","columns":"review","calendar-remove":"review","folder-remove":"review","document-remove":"review"}},{"id":"batch-24","title":"Batch 24 · Lists & sorting","icons":{"list-numbered":"review","sort-ascending":"review","filter-dismiss":"approved","bookmark-add":"review","reply-all":"review","text-cursor":"review"}},{"id":"batch-25","title":"Batch 25 · View & tools","icons":{"zoom-fit":"review","paint-bucket":"review","panel-bottom":"review","panel-left-close":"review","panel-left-open":"review"}},{"id":"batch-26","title":"Batch 26 · Lists, marks & tools","icons":{"checkbox":"review","list-checklist":"review","bookmark-remove":"review","filter-add":"review","pushpin":"review","palette":"review"}},{"id":"batch-27","title":"Batch 27 · AI & chat","icons":{"arrow-up-circle":"review","stop-circle":"review","compose":"review","waveform":"review","bot":"review"}},{"id":"batch-28","title":"Batch 28 · Figma tools","icons":{"frame":"review","pen-tool":"review","hand":"review","spline":"review","unpin":"review"}},{"id":"batch-29","title":"Batch 29 · Commerce & objects","icons":{"truck":"review","store":"review","ticket":"review","kanban":"review"}},{"id":"batch-30","title":"Batch 30 · Nature & tools","icons":{"highlighter":"review","flame":"review","leaf":"review","umbrella":"review","snowflake":"review","thermometer":"review","mountain":"review","anchor":"review","magnet":"review"}},{"id":"batch-31","title":"Batch 31 · Weather, shapes & money","icons":{"cloud-rain":"review","cloud-lightning":"review","wind":"review","star-off":"review","qr-code":"review","rectangle":"review","ellipse":"review","coins":"review"}},{"id":"batch-32","title":"Batch 32 · Demo gaps & arrows","icons":{"arrow-up-right":"review","cloud-sun":"review","wand":"review","distribute-horizontal":"review","record":"review"}},{"id":"batch-33","title":"Batch 33 · Figma tools 2","icons":{"line":"review","polygon":"review","diamond":"review","mask":"review","boolean-union":"review","boolean-subtract":"review","boolean-intersect":"review","boolean-exclude":"review"}},{"id":"batch-34","title":"Batch 34 · Code & git","icons":{"git-commit":"review","git-merge":"review","braces":"review","variable":"review","function":"review","sigma":"review"}},{"id":"batch-35","title":"Batch 35 · Media & capture","icons":{"fast-forward":"review","screen-share":"review","picture-in-picture":"review","images":"review","captions":"review","camera-off":"review"}},{"id":"batch-38","title":"Batch 38 · Documents, money & awards","icons":{"library":"review","code-block":"review","banknote":"review","bank":"review","barcode":"review","award":"review","crown":"review"}},{"id":"batch-39","title":"Batch 39 · People & talk","icons":{"frown":"review","person-circle":"review","chat-multiple":"review","call-end":"review"}},{"id":"batch-40","title":"Batch 40 · Nature & science","icons":{"contrast":"review","flask":"review","tree":"review"}},{"id":"batch-42","title":"Batch 42 · Keys & effects","icons":{"shift":"review","option":"review","stroke-weight":"review"}},{"id":"batch-41","title":"Batch 41 · Type","icons":{"text-size":"review","superscript":"review","subscript":"review"}},{"id":"batch-43","title":"Batch 43 · Simplified returns","icons":{"id-card":"review","newspaper":"review","file-image":"review","file-code":"review","git-pull-request":"review","plane":"review","paw":"review","escape":"review","shadow":"review","blur":"review","line-height":"review","letter-spacing":"review","translate":"review"}}] as const;

export const PILOT_ICONS = [
  { name: "activity", keyline: "horizontal", derivedFrom: undefined, Icon: PilotActivityIcon, Filled: PilotActivityFilledIcon, fill: "weight" },
  { name: "add", keyline: "square", derivedFrom: undefined, Icon: PilotAddIcon, Filled: PilotAddFilledIcon, fill: "weight" },
  { name: "add-circle", keyline: "circle", derivedFrom: undefined, Icon: PilotAddCircleIcon, Filled: PilotAddCircleFilledIcon, fill: "solid" },
  { name: "alarm", keyline: "circle", derivedFrom: undefined, Icon: PilotAlarmIcon, Filled: PilotAlarmFilledIcon, fill: "solid" },
  { name: "align-bottom", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignBottomIcon, Filled: PilotAlignBottomFilledIcon, fill: "solid" },
  { name: "align-center", keyline: "square", derivedFrom: undefined, Icon: PilotAlignCenterIcon, Filled: PilotAlignCenterFilledIcon, fill: "solid" },
  { name: "align-left", keyline: "square", derivedFrom: undefined, Icon: PilotAlignLeftIcon, Filled: PilotAlignLeftFilledIcon, fill: "solid" },
  { name: "align-middle", keyline: "square", derivedFrom: "align-center", Icon: PilotAlignMiddleIcon, Filled: PilotAlignMiddleFilledIcon, fill: "solid" },
  { name: "align-right", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignRightIcon, Filled: PilotAlignRightFilledIcon, fill: "solid" },
  { name: "align-top", keyline: "square", derivedFrom: "align-left", Icon: PilotAlignTopIcon, Filled: PilotAlignTopFilledIcon, fill: "solid" },
  { name: "anchor", keyline: "square", derivedFrom: undefined, Icon: PilotAnchorIcon, Filled: PilotAnchorFilledIcon, fill: "weight" },
  { name: "angle", keyline: "square", derivedFrom: undefined, Icon: PilotAngleIcon, Filled: PilotAngleFilledIcon, fill: "weight" },
  { name: "archive", keyline: "horizontal", derivedFrom: undefined, Icon: PilotArchiveIcon, Filled: PilotArchiveFilledIcon, fill: "solid" },
  { name: "arrow-down", keyline: "vertical", derivedFrom: "arrow-up", Icon: PilotArrowDownIcon, Filled: PilotArrowDownFilledIcon, fill: "weight" },
  { name: "arrow-down-left", keyline: "square", derivedFrom: "arrow-up-right", Icon: PilotArrowDownLeftIcon, Filled: PilotArrowDownLeftFilledIcon, fill: "weight" },
  { name: "arrow-down-right", keyline: "square", derivedFrom: "arrow-up-right", Icon: PilotArrowDownRightIcon, Filled: PilotArrowDownRightFilledIcon, fill: "weight" },
  { name: "arrow-left", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowLeftIcon, Filled: PilotArrowLeftFilledIcon, fill: "weight" },
  { name: "arrow-right", keyline: "horizontal", derivedFrom: "arrow-up", Icon: PilotArrowRightIcon, Filled: PilotArrowRightFilledIcon, fill: "weight" },
  { name: "arrow-up", keyline: "vertical", derivedFrom: undefined, Icon: PilotArrowUpIcon, Filled: PilotArrowUpFilledIcon, fill: "weight" },
  { name: "arrow-up-circle", keyline: "circle", derivedFrom: undefined, Icon: PilotArrowUpCircleIcon, Filled: PilotArrowUpCircleFilledIcon, fill: "solid" },
  { name: "arrow-up-left", keyline: "square", derivedFrom: "arrow-up-right", Icon: PilotArrowUpLeftIcon, Filled: PilotArrowUpLeftFilledIcon, fill: "weight" },
  { name: "arrow-up-right", keyline: "square", derivedFrom: undefined, Icon: PilotArrowUpRightIcon, Filled: PilotArrowUpRightFilledIcon, fill: "weight" },
  { name: "aspect-ratio", keyline: "square", derivedFrom: undefined, Icon: PilotAspectRatioIcon, Filled: PilotAspectRatioFilledIcon, fill: "solid" },
  { name: "at", keyline: "circle", derivedFrom: undefined, Icon: PilotAtIcon, Filled: PilotAtFilledIcon, fill: "weight" },
  { name: "attach", keyline: "circle", derivedFrom: undefined, Icon: PilotAttachIcon, Filled: PilotAttachFilledIcon, fill: "weight" },
  { name: "auto-layout", keyline: "square", derivedFrom: undefined, Icon: PilotAutoLayoutIcon, Filled: PilotAutoLayoutFilledIcon, fill: "solid" },
  { name: "award", keyline: "vertical", derivedFrom: undefined, Icon: PilotAwardIcon, Filled: PilotAwardFilledIcon, fill: "solid" },
  { name: "backspace", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBackspaceIcon, Filled: PilotBackspaceFilledIcon, fill: "solid" },
  { name: "bank", keyline: "square", derivedFrom: undefined, Icon: PilotBankIcon, Filled: PilotBankFilledIcon, fill: "solid" },
  { name: "banknote", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBanknoteIcon, Filled: PilotBanknoteFilledIcon, fill: "solid" },
  { name: "bar-chart", keyline: "square", derivedFrom: undefined, Icon: PilotBarChartIcon, Filled: PilotBarChartFilledIcon, fill: "weight" },
  { name: "barcode", keyline: "square", derivedFrom: undefined, Icon: PilotBarcodeIcon, Filled: PilotBarcodeFilledIcon, fill: "weight" },
  { name: "battery", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBatteryIcon, Filled: PilotBatteryFilledIcon, fill: "solid" },
  { name: "bell", keyline: "square", derivedFrom: undefined, Icon: PilotBellIcon, Filled: PilotBellFilledIcon, fill: "solid" },
  { name: "bell-off", keyline: "square", derivedFrom: undefined, Icon: PilotBellOffIcon, Filled: PilotBellOffFilledIcon, fill: "solid" },
  { name: "bluetooth", keyline: "vertical", derivedFrom: undefined, Icon: PilotBluetoothIcon, Filled: PilotBluetoothFilledIcon, fill: "weight" },
  { name: "blur", keyline: "circle", derivedFrom: undefined, Icon: PilotBlurIcon, Filled: PilotBlurFilledIcon, fill: "solid" },
  { name: "bold", keyline: "vertical", derivedFrom: undefined, Icon: PilotBoldIcon, Filled: PilotBoldFilledIcon, fill: "weight" },
  { name: "book", keyline: "horizontal", derivedFrom: undefined, Icon: PilotBookIcon, Filled: PilotBookFilledIcon, fill: "solid" },
  { name: "bookmark", keyline: "vertical", derivedFrom: undefined, Icon: PilotBookmarkIcon, Filled: PilotBookmarkFilledIcon, fill: "solid" },
  { name: "bookmark-add", keyline: "vertical", derivedFrom: undefined, Icon: PilotBookmarkAddIcon, Filled: PilotBookmarkAddFilledIcon, fill: "solid" },
  { name: "bookmark-remove", keyline: "vertical", derivedFrom: undefined, Icon: PilotBookmarkRemoveIcon, Filled: PilotBookmarkRemoveFilledIcon, fill: "solid" },
  { name: "boolean-exclude", keyline: "square", derivedFrom: undefined, Icon: PilotBooleanExcludeIcon, Filled: PilotBooleanExcludeFilledIcon, fill: "weight" },
  { name: "boolean-intersect", keyline: "square", derivedFrom: undefined, Icon: PilotBooleanIntersectIcon, Filled: PilotBooleanIntersectFilledIcon, fill: "weight" },
  { name: "boolean-subtract", keyline: "square", derivedFrom: undefined, Icon: PilotBooleanSubtractIcon, Filled: PilotBooleanSubtractFilledIcon, fill: "weight" },
  { name: "boolean-union", keyline: "square", derivedFrom: undefined, Icon: PilotBooleanUnionIcon, Filled: PilotBooleanUnionFilledIcon, fill: "solid" },
  { name: "bot", keyline: "square", derivedFrom: undefined, Icon: PilotBotIcon, Filled: PilotBotFilledIcon, fill: "solid" },
  { name: "braces", keyline: "square", derivedFrom: undefined, Icon: PilotBracesIcon, Filled: PilotBracesFilledIcon, fill: "weight" },
  { name: "briefcase", keyline: "square", derivedFrom: undefined, Icon: PilotBriefcaseIcon, Filled: PilotBriefcaseFilledIcon, fill: "solid" },
  { name: "bug", keyline: "square", derivedFrom: undefined, Icon: PilotBugIcon, Filled: PilotBugFilledIcon, fill: "solid" },
  { name: "building", keyline: "vertical", derivedFrom: undefined, Icon: PilotBuildingIcon, Filled: PilotBuildingFilledIcon, fill: "solid" },
  { name: "calculator", keyline: "square", derivedFrom: undefined, Icon: PilotCalculatorIcon, Filled: PilotCalculatorFilledIcon, fill: "solid" },
  { name: "calendar", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarIcon, Filled: PilotCalendarFilledIcon, fill: "solid" },
  { name: "calendar-add", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarAddIcon, Filled: PilotCalendarAddFilledIcon, fill: "solid" },
  { name: "calendar-check", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarCheckIcon, Filled: PilotCalendarCheckFilledIcon, fill: "solid" },
  { name: "calendar-remove", keyline: "square", derivedFrom: undefined, Icon: PilotCalendarRemoveIcon, Filled: PilotCalendarRemoveFilledIcon, fill: "solid" },
  { name: "call", keyline: "square", derivedFrom: undefined, Icon: PilotCallIcon, Filled: PilotCallFilledIcon, fill: "solid" },
  { name: "call-end", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCallEndIcon, Filled: PilotCallEndFilledIcon, fill: "solid" },
  { name: "camera", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCameraIcon, Filled: PilotCameraFilledIcon, fill: "solid" },
  { name: "camera-off", keyline: "square", derivedFrom: undefined, Icon: PilotCameraOffIcon, Filled: PilotCameraOffFilledIcon, fill: "solid" },
  { name: "captions", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCaptionsIcon, Filled: PilotCaptionsFilledIcon, fill: "solid" },
  { name: "car", keyline: "square", derivedFrom: undefined, Icon: PilotCarIcon, Filled: PilotCarFilledIcon, fill: "solid" },
  { name: "cart", keyline: "square", derivedFrom: undefined, Icon: PilotCartIcon, Filled: PilotCartFilledIcon, fill: "weight" },
  { name: "chart", keyline: "square", derivedFrom: undefined, Icon: PilotChartIcon, Filled: PilotChartFilledIcon, fill: "weight" },
  { name: "chat", keyline: "square", derivedFrom: undefined, Icon: PilotChatIcon, Filled: PilotChatFilledIcon, fill: "solid" },
  { name: "chat-add", keyline: "square", derivedFrom: undefined, Icon: PilotChatAddIcon, Filled: PilotChatAddFilledIcon, fill: "solid" },
  { name: "chat-multiple", keyline: "square", derivedFrom: undefined, Icon: PilotChatMultipleIcon, Filled: PilotChatMultipleFilledIcon, fill: "solid" },
  { name: "check", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCheckIcon, Filled: PilotCheckFilledIcon, fill: "weight" },
  { name: "checkbox", keyline: "square", derivedFrom: undefined, Icon: PilotCheckboxIcon, Filled: PilotCheckboxFilledIcon, fill: "solid" },
  { name: "chevron-down", keyline: "horizontal", derivedFrom: undefined, Icon: PilotChevronDownIcon, Filled: PilotChevronDownFilledIcon, fill: "weight" },
  { name: "chevron-left", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronLeftIcon, Filled: PilotChevronLeftFilledIcon, fill: "weight" },
  { name: "chevron-right", keyline: "vertical", derivedFrom: "chevron-down", Icon: PilotChevronRightIcon, Filled: PilotChevronRightFilledIcon, fill: "weight" },
  { name: "chevron-up", keyline: "horizontal", derivedFrom: "chevron-down", Icon: PilotChevronUpIcon, Filled: PilotChevronUpFilledIcon, fill: "weight" },
  { name: "chevrons-up-down", keyline: "vertical", derivedFrom: undefined, Icon: PilotChevronsUpDownIcon, Filled: PilotChevronsUpDownFilledIcon, fill: "weight" },
  { name: "chip", keyline: "square", derivedFrom: undefined, Icon: PilotChipIcon, Filled: PilotChipFilledIcon, fill: "solid" },
  { name: "clipboard", keyline: "vertical", derivedFrom: undefined, Icon: PilotClipboardIcon, Filled: PilotClipboardFilledIcon, fill: "solid" },
  { name: "clock", keyline: "circle", derivedFrom: undefined, Icon: PilotClockIcon, Filled: PilotClockFilledIcon, fill: "solid" },
  { name: "cloud", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCloudIcon, Filled: PilotCloudFilledIcon, fill: "solid" },
  { name: "cloud-download", keyline: "square", derivedFrom: undefined, Icon: PilotCloudDownloadIcon, Filled: PilotCloudDownloadFilledIcon, fill: "solid" },
  { name: "cloud-lightning", keyline: "square", derivedFrom: undefined, Icon: PilotCloudLightningIcon, Filled: PilotCloudLightningFilledIcon, fill: "solid" },
  { name: "cloud-off", keyline: "square", derivedFrom: undefined, Icon: PilotCloudOffIcon, Filled: PilotCloudOffFilledIcon, fill: "solid" },
  { name: "cloud-rain", keyline: "square", derivedFrom: undefined, Icon: PilotCloudRainIcon, Filled: PilotCloudRainFilledIcon, fill: "solid" },
  { name: "cloud-sun", keyline: "square", derivedFrom: undefined, Icon: PilotCloudSunIcon, Filled: PilotCloudSunFilledIcon, fill: "solid" },
  { name: "cloud-upload", keyline: "square", derivedFrom: undefined, Icon: PilotCloudUploadIcon, Filled: PilotCloudUploadFilledIcon, fill: "solid" },
  { name: "code", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCodeIcon, Filled: PilotCodeFilledIcon, fill: "weight" },
  { name: "code-block", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCodeBlockIcon, Filled: PilotCodeBlockFilledIcon, fill: "solid" },
  { name: "coffee", keyline: "square", derivedFrom: undefined, Icon: PilotCoffeeIcon, Filled: PilotCoffeeFilledIcon, fill: "solid" },
  { name: "coins", keyline: "square", derivedFrom: undefined, Icon: PilotCoinsIcon, Filled: PilotCoinsFilledIcon, fill: "solid" },
  { name: "collapse", keyline: "square", derivedFrom: undefined, Icon: PilotCollapseIcon, Filled: PilotCollapseFilledIcon, fill: "weight" },
  { name: "color", keyline: "vertical", derivedFrom: undefined, Icon: PilotColorIcon, Filled: PilotColorFilledIcon, fill: "solid" },
  { name: "columns", keyline: "square", derivedFrom: undefined, Icon: PilotColumnsIcon, Filled: PilotColumnsFilledIcon, fill: "solid" },
  { name: "command", keyline: "square", derivedFrom: undefined, Icon: PilotCommandIcon, Filled: PilotCommandFilledIcon, fill: "weight" },
  { name: "compass", keyline: "circle", derivedFrom: undefined, Icon: PilotCompassIcon, Filled: PilotCompassFilledIcon, fill: "solid" },
  { name: "compose", keyline: "square", derivedFrom: undefined, Icon: PilotComposeIcon, Filled: PilotComposeFilledIcon, fill: "solid" },
  { name: "contrast", keyline: "circle", derivedFrom: undefined, Icon: PilotContrastIcon, Filled: PilotContrastFilledIcon, fill: "weight" },
  { name: "copy", keyline: "square", derivedFrom: undefined, Icon: PilotCopyIcon, Filled: PilotCopyFilledIcon, fill: "solid" },
  { name: "corner", keyline: "square", derivedFrom: undefined, Icon: PilotCornerIcon, Filled: PilotCornerFilledIcon, fill: "weight" },
  { name: "corner-bottom-left", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomLeftIcon, Filled: PilotCornerBottomLeftFilledIcon, fill: "weight" },
  { name: "corner-bottom-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerBottomRightIcon, Filled: PilotCornerBottomRightFilledIcon, fill: "weight" },
  { name: "corner-top-right", keyline: "square", derivedFrom: "corner", Icon: PilotCornerTopRightIcon, Filled: PilotCornerTopRightFilledIcon, fill: "weight" },
  { name: "corners", keyline: "square", derivedFrom: undefined, Icon: PilotCornersIcon, Filled: PilotCornersFilledIcon, fill: "weight" },
  { name: "credit-card", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCreditCardIcon, Filled: PilotCreditCardFilledIcon, fill: "solid" },
  { name: "crop", keyline: "square", derivedFrom: undefined, Icon: PilotCropIcon, Filled: PilotCropFilledIcon, fill: "weight" },
  { name: "crown", keyline: "horizontal", derivedFrom: undefined, Icon: PilotCrownIcon, Filled: PilotCrownFilledIcon, fill: "solid" },
  { name: "database", keyline: "square", derivedFrom: undefined, Icon: PilotDatabaseIcon, Filled: PilotDatabaseFilledIcon, fill: "solid" },
  { name: "desktop", keyline: "square", derivedFrom: undefined, Icon: PilotDesktopIcon, Filled: PilotDesktopFilledIcon, fill: "solid" },
  { name: "diamond", keyline: "circle", derivedFrom: undefined, Icon: PilotDiamondIcon, Filled: PilotDiamondFilledIcon, fill: "solid" },
  { name: "dismiss", keyline: "circle", derivedFrom: undefined, Icon: PilotDismissIcon, Filled: PilotDismissFilledIcon, fill: "weight" },
  { name: "distribute-horizontal", keyline: "square", derivedFrom: undefined, Icon: PilotDistributeHorizontalIcon, Filled: PilotDistributeHorizontalFilledIcon, fill: "solid" },
  { name: "distribute-vertical", keyline: "square", derivedFrom: "distribute-horizontal", Icon: PilotDistributeVerticalIcon, Filled: PilotDistributeVerticalFilledIcon, fill: "solid" },
  { name: "document", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentIcon, Filled: PilotDocumentFilledIcon, fill: "solid" },
  { name: "document-add", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentAddIcon, Filled: PilotDocumentAddFilledIcon, fill: "solid" },
  { name: "document-check", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentCheckIcon, Filled: PilotDocumentCheckFilledIcon, fill: "solid" },
  { name: "document-remove", keyline: "vertical", derivedFrom: undefined, Icon: PilotDocumentRemoveIcon, Filled: PilotDocumentRemoveFilledIcon, fill: "solid" },
  { name: "dots-four", keyline: "square", derivedFrom: undefined, Icon: PilotDotsFourIcon, Filled: PilotDotsFourFilledIcon, fill: "solid" },
  { name: "download", keyline: "square", derivedFrom: undefined, Icon: PilotDownloadIcon, Filled: PilotDownloadFilledIcon, fill: "weight" },
  { name: "ellipse", keyline: "circle", derivedFrom: undefined, Icon: PilotEllipseIcon, Filled: PilotEllipseFilledIcon, fill: "solid" },
  { name: "eraser", keyline: "square", derivedFrom: undefined, Icon: PilotEraserIcon, Filled: PilotEraserFilledIcon, fill: "solid" },
  { name: "error", keyline: "circle", derivedFrom: undefined, Icon: PilotErrorIcon, Filled: PilotErrorFilledIcon, fill: "solid" },
  { name: "escape", keyline: "circle", derivedFrom: undefined, Icon: PilotEscapeIcon, Filled: PilotEscapeFilledIcon, fill: "weight" },
  { name: "expand", keyline: "square", derivedFrom: undefined, Icon: PilotExpandIcon, Filled: PilotExpandFilledIcon, fill: "weight" },
  { name: "eye", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeIcon, Filled: PilotEyeFilledIcon, fill: "solid" },
  { name: "eye-off", keyline: "horizontal", derivedFrom: undefined, Icon: PilotEyeOffIcon, Filled: PilotEyeOffFilledIcon, fill: "weight" },
  { name: "eyedropper", keyline: "square", derivedFrom: undefined, Icon: PilotEyedropperIcon, Filled: PilotEyedropperFilledIcon, fill: "solid" },
  { name: "fast-forward", keyline: "square", derivedFrom: undefined, Icon: PilotFastForwardIcon, Filled: PilotFastForwardFilledIcon, fill: "solid" },
  { name: "file-code", keyline: "square", derivedFrom: undefined, Icon: PilotFileCodeIcon, Filled: PilotFileCodeFilledIcon, fill: "solid" },
  { name: "file-image", keyline: "vertical", derivedFrom: undefined, Icon: PilotFileImageIcon, Filled: PilotFileImageFilledIcon, fill: "solid" },
  { name: "film", keyline: "square", derivedFrom: undefined, Icon: PilotFilmIcon, Filled: PilotFilmFilledIcon, fill: "solid" },
  { name: "filter", keyline: "square", derivedFrom: undefined, Icon: PilotFilterIcon, Filled: PilotFilterFilledIcon, fill: "solid" },
  { name: "filter-add", keyline: "square", derivedFrom: undefined, Icon: PilotFilterAddIcon, Filled: PilotFilterAddFilledIcon, fill: "solid" },
  { name: "filter-dismiss", keyline: "square", derivedFrom: undefined, Icon: PilotFilterDismissIcon, Filled: PilotFilterDismissFilledIcon, fill: "solid" },
  { name: "fingerprint", keyline: "circle", derivedFrom: undefined, Icon: PilotFingerprintIcon, Filled: PilotFingerprintFilledIcon, fill: "weight" },
  { name: "flag", keyline: "square", derivedFrom: undefined, Icon: PilotFlagIcon, Filled: PilotFlagFilledIcon, fill: "solid" },
  { name: "flame", keyline: "circle", derivedFrom: undefined, Icon: PilotFlameIcon, Filled: PilotFlameFilledIcon, fill: "solid" },
  { name: "flash", keyline: "vertical", derivedFrom: undefined, Icon: PilotFlashIcon, Filled: PilotFlashFilledIcon, fill: "solid" },
  { name: "flask", keyline: "vertical", derivedFrom: undefined, Icon: PilotFlaskIcon, Filled: PilotFlaskFilledIcon, fill: "solid" },
  { name: "flip", keyline: "square", derivedFrom: undefined, Icon: PilotFlipIcon, Filled: PilotFlipFilledIcon, fill: "solid" },
  { name: "flip-vertical", keyline: "square", derivedFrom: "flip", Icon: PilotFlipVerticalIcon, Filled: PilotFlipVerticalFilledIcon, fill: "solid" },
  { name: "flow", keyline: "square", derivedFrom: undefined, Icon: PilotFlowIcon, Filled: PilotFlowFilledIcon, fill: "solid" },
  { name: "flow-free", keyline: "square", derivedFrom: undefined, Icon: PilotFlowFreeIcon, Filled: PilotFlowFreeFilledIcon, fill: "solid" },
  { name: "flow-vertical", keyline: "square", derivedFrom: "flow", Icon: PilotFlowVerticalIcon, Filled: PilotFlowVerticalFilledIcon, fill: "solid" },
  { name: "flow-wrap", keyline: "square", derivedFrom: undefined, Icon: PilotFlowWrapIcon, Filled: PilotFlowWrapFilledIcon, fill: "solid" },
  { name: "folder", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderIcon, Filled: PilotFolderFilledIcon, fill: "solid" },
  { name: "folder-add", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderAddIcon, Filled: PilotFolderAddFilledIcon, fill: "solid" },
  { name: "folder-open", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderOpenIcon, Filled: PilotFolderOpenFilledIcon, fill: "solid" },
  { name: "folder-remove", keyline: "horizontal", derivedFrom: undefined, Icon: PilotFolderRemoveIcon, Filled: PilotFolderRemoveFilledIcon, fill: "solid" },
  { name: "forward", keyline: "square", derivedFrom: "reply", Icon: PilotForwardIcon, Filled: PilotForwardFilledIcon, fill: "weight" },
  { name: "frame", keyline: "square", derivedFrom: undefined, Icon: PilotFrameIcon, Filled: PilotFrameFilledIcon, fill: "weight" },
  { name: "frown", keyline: "circle", derivedFrom: undefined, Icon: PilotFrownIcon, Filled: PilotFrownFilledIcon, fill: "solid" },
  { name: "function", keyline: "vertical", derivedFrom: undefined, Icon: PilotFunctionIcon, Filled: PilotFunctionFilledIcon, fill: "weight" },
  { name: "gap", keyline: "square", derivedFrom: undefined, Icon: PilotGapIcon, Filled: PilotGapFilledIcon, fill: "weight" },
  { name: "gap-vertical", keyline: "square", derivedFrom: "gap", Icon: PilotGapVerticalIcon, Filled: PilotGapVerticalFilledIcon, fill: "weight" },
  { name: "gauge", keyline: "horizontal", derivedFrom: undefined, Icon: PilotGaugeIcon, Filled: PilotGaugeFilledIcon, fill: "weight" },
  { name: "gift", keyline: "square", derivedFrom: undefined, Icon: PilotGiftIcon, Filled: PilotGiftFilledIcon, fill: "solid" },
  { name: "git-branch", keyline: "square", derivedFrom: undefined, Icon: PilotGitBranchIcon, Filled: PilotGitBranchFilledIcon, fill: "solid" },
  { name: "git-commit", keyline: "horizontal", derivedFrom: undefined, Icon: PilotGitCommitIcon, Filled: PilotGitCommitFilledIcon, fill: "solid" },
  { name: "git-merge", keyline: "square", derivedFrom: undefined, Icon: PilotGitMergeIcon, Filled: PilotGitMergeFilledIcon, fill: "solid" },
  { name: "git-pull-request", keyline: "square", derivedFrom: undefined, Icon: PilotGitPullRequestIcon, Filled: PilotGitPullRequestFilledIcon, fill: "solid" },
  { name: "globe", keyline: "circle", derivedFrom: undefined, Icon: PilotGlobeIcon, Filled: PilotGlobeFilledIcon, fill: "solid" },
  { name: "graduation-cap", keyline: "horizontal", derivedFrom: undefined, Icon: PilotGraduationCapIcon, Filled: PilotGraduationCapFilledIcon, fill: "solid" },
  { name: "grid", keyline: "square", derivedFrom: undefined, Icon: PilotGridIcon, Filled: PilotGridFilledIcon, fill: "solid" },
  { name: "grip", keyline: "horizontal", derivedFrom: undefined, Icon: PilotGripIcon, Filled: PilotGripFilledIcon, fill: "weight" },
  { name: "grip-horizontal", keyline: "horizontal", derivedFrom: "grip-vertical", Icon: PilotGripHorizontalIcon, Filled: PilotGripHorizontalFilledIcon, fill: "weight" },
  { name: "grip-vertical", keyline: "vertical", derivedFrom: undefined, Icon: PilotGripVerticalIcon, Filled: PilotGripVerticalFilledIcon, fill: "weight" },
  { name: "hand", keyline: "square", derivedFrom: undefined, Icon: PilotHandIcon, Filled: PilotHandFilledIcon, fill: "weight" },
  { name: "hard-drive", keyline: "horizontal", derivedFrom: undefined, Icon: PilotHardDriveIcon, Filled: PilotHardDriveFilledIcon, fill: "solid" },
  { name: "hash", keyline: "square", derivedFrom: undefined, Icon: PilotHashIcon, Filled: PilotHashFilledIcon, fill: "weight" },
  { name: "heading", keyline: "square", derivedFrom: undefined, Icon: PilotHeadingIcon, Filled: PilotHeadingFilledIcon, fill: "weight" },
  { name: "headphones", keyline: "circle", derivedFrom: undefined, Icon: PilotHeadphonesIcon, Filled: PilotHeadphonesFilledIcon, fill: "solid" },
  { name: "heart", keyline: "circle", derivedFrom: undefined, Icon: PilotHeartIcon, Filled: PilotHeartFilledIcon, fill: "solid" },
  { name: "help", keyline: "circle", derivedFrom: undefined, Icon: PilotHelpIcon, Filled: PilotHelpFilledIcon, fill: "solid" },
  { name: "highlighter", keyline: "square", derivedFrom: undefined, Icon: PilotHighlighterIcon, Filled: PilotHighlighterFilledIcon, fill: "solid" },
  { name: "history", keyline: "circle", derivedFrom: undefined, Icon: PilotHistoryIcon, Filled: PilotHistoryFilledIcon, fill: "weight" },
  { name: "home", keyline: "square", derivedFrom: undefined, Icon: PilotHomeIcon, Filled: PilotHomeFilledIcon, fill: "solid" },
  { name: "hourglass", keyline: "vertical", derivedFrom: undefined, Icon: PilotHourglassIcon, Filled: PilotHourglassFilledIcon, fill: "solid" },
  { name: "id-card", keyline: "horizontal", derivedFrom: undefined, Icon: PilotIdCardIcon, Filled: PilotIdCardFilledIcon, fill: "solid" },
  { name: "image", keyline: "square", derivedFrom: undefined, Icon: PilotImageIcon, Filled: PilotImageFilledIcon, fill: "solid" },
  { name: "images", keyline: "square", derivedFrom: undefined, Icon: PilotImagesIcon, Filled: PilotImagesFilledIcon, fill: "solid" },
  { name: "inbox", keyline: "square", derivedFrom: undefined, Icon: PilotInboxIcon, Filled: PilotInboxFilledIcon, fill: "solid" },
  { name: "indent", keyline: "square", derivedFrom: undefined, Icon: PilotIndentIcon, Filled: PilotIndentFilledIcon, fill: "weight" },
  { name: "info", keyline: "circle", derivedFrom: undefined, Icon: PilotInfoIcon, Filled: PilotInfoFilledIcon, fill: "solid" },
  { name: "italic", keyline: "vertical", derivedFrom: undefined, Icon: PilotItalicIcon, Filled: PilotItalicFilledIcon, fill: "weight" },
  { name: "kanban", keyline: "square", derivedFrom: undefined, Icon: PilotKanbanIcon, Filled: PilotKanbanFilledIcon, fill: "solid" },
  { name: "key", keyline: "circle", derivedFrom: undefined, Icon: PilotKeyIcon, Filled: PilotKeyFilledIcon, fill: "solid" },
  { name: "keyboard", keyline: "horizontal", derivedFrom: undefined, Icon: PilotKeyboardIcon, Filled: PilotKeyboardFilledIcon, fill: "solid" },
  { name: "laptop", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLaptopIcon, Filled: PilotLaptopFilledIcon, fill: "solid" },
  { name: "layers", keyline: "square", derivedFrom: undefined, Icon: PilotLayersIcon, Filled: PilotLayersFilledIcon, fill: "solid" },
  { name: "layout", keyline: "square", derivedFrom: undefined, Icon: PilotLayoutIcon, Filled: PilotLayoutFilledIcon, fill: "solid" },
  { name: "leaf", keyline: "vertical", derivedFrom: undefined, Icon: PilotLeafIcon, Filled: PilotLeafFilledIcon, fill: "solid" },
  { name: "letter-spacing", keyline: "square", derivedFrom: undefined, Icon: PilotLetterSpacingIcon, Filled: PilotLetterSpacingFilledIcon, fill: "weight" },
  { name: "library", keyline: "square", derivedFrom: undefined, Icon: PilotLibraryIcon, Filled: PilotLibraryFilledIcon, fill: "weight" },
  { name: "lightbulb", keyline: "vertical", derivedFrom: undefined, Icon: PilotLightbulbIcon, Filled: PilotLightbulbFilledIcon, fill: "solid" },
  { name: "line", keyline: "square", derivedFrom: undefined, Icon: PilotLineIcon, Filled: PilotLineFilledIcon, fill: "weight" },
  { name: "line-height", keyline: "square", derivedFrom: undefined, Icon: PilotLineHeightIcon, Filled: PilotLineHeightFilledIcon, fill: "weight" },
  { name: "link", keyline: "horizontal", derivedFrom: undefined, Icon: PilotLinkIcon, Filled: PilotLinkFilledIcon, fill: "weight" },
  { name: "link-off", keyline: "square", derivedFrom: undefined, Icon: PilotLinkOffIcon, Filled: PilotLinkOffFilledIcon, fill: "weight" },
  { name: "list", keyline: "horizontal", derivedFrom: undefined, Icon: PilotListIcon, Filled: PilotListFilledIcon, fill: "weight" },
  { name: "list-bullet", keyline: "square", derivedFrom: undefined, Icon: PilotListBulletIcon, Filled: PilotListBulletFilledIcon, fill: "weight" },
  { name: "list-checklist", keyline: "square", derivedFrom: undefined, Icon: PilotListChecklistIcon, Filled: PilotListChecklistFilledIcon, fill: "weight" },
  { name: "list-numbered", keyline: "square", derivedFrom: undefined, Icon: PilotListNumberedIcon, Filled: PilotListNumberedFilledIcon, fill: "weight" },
  { name: "loader", keyline: "circle", derivedFrom: undefined, Icon: PilotLoaderIcon, Filled: PilotLoaderFilledIcon, fill: "weight" },
  { name: "lock", keyline: "vertical", derivedFrom: undefined, Icon: PilotLockIcon, Filled: PilotLockFilledIcon, fill: "solid" },
  { name: "log-in", keyline: "square", derivedFrom: undefined, Icon: PilotLogInIcon, Filled: PilotLogInFilledIcon, fill: "weight" },
  { name: "log-out", keyline: "square", derivedFrom: undefined, Icon: PilotLogOutIcon, Filled: PilotLogOutFilledIcon, fill: "weight" },
  { name: "magnet", keyline: "square", derivedFrom: undefined, Icon: PilotMagnetIcon, Filled: PilotMagnetFilledIcon, fill: "solid" },
  { name: "mail", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMailIcon, Filled: PilotMailFilledIcon, fill: "solid" },
  { name: "mail-open", keyline: "square", derivedFrom: undefined, Icon: PilotMailOpenIcon, Filled: PilotMailOpenFilledIcon, fill: "solid" },
  { name: "map", keyline: "square", derivedFrom: undefined, Icon: PilotMapIcon, Filled: PilotMapFilledIcon, fill: "weight" },
  { name: "mask", keyline: "square", derivedFrom: undefined, Icon: PilotMaskIcon, Filled: PilotMaskFilledIcon, fill: "solid" },
  { name: "megaphone", keyline: "square", derivedFrom: undefined, Icon: PilotMegaphoneIcon, Filled: PilotMegaphoneFilledIcon, fill: "solid" },
  { name: "menu", keyline: "square", derivedFrom: undefined, Icon: PilotMenuIcon, Filled: PilotMenuFilledIcon, fill: "weight" },
  { name: "mic", keyline: "vertical", derivedFrom: undefined, Icon: PilotMicIcon, Filled: PilotMicFilledIcon, fill: "solid" },
  { name: "mic-off", keyline: "square", derivedFrom: undefined, Icon: PilotMicOffIcon, Filled: PilotMicOffFilledIcon, fill: "solid" },
  { name: "minus", keyline: "square", derivedFrom: undefined, Icon: PilotMinusIcon, Filled: PilotMinusFilledIcon, fill: "weight" },
  { name: "moon", keyline: "circle", derivedFrom: undefined, Icon: PilotMoonIcon, Filled: PilotMoonFilledIcon, fill: "solid" },
  { name: "more-horizontal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMoreHorizontalIcon, Filled: PilotMoreHorizontalFilledIcon, fill: "weight" },
  { name: "more-vertical", keyline: "vertical", derivedFrom: "more-horizontal", Icon: PilotMoreVerticalIcon, Filled: PilotMoreVerticalFilledIcon, fill: "weight" },
  { name: "mountain", keyline: "horizontal", derivedFrom: undefined, Icon: PilotMountainIcon, Filled: PilotMountainFilledIcon, fill: "solid" },
  { name: "mouse", keyline: "vertical", derivedFrom: undefined, Icon: PilotMouseIcon, Filled: PilotMouseFilledIcon, fill: "solid" },
  { name: "move", keyline: "circle", derivedFrom: undefined, Icon: PilotMoveIcon, Filled: PilotMoveFilledIcon, fill: "weight" },
  { name: "music", keyline: "square", derivedFrom: undefined, Icon: PilotMusicIcon, Filled: PilotMusicFilledIcon, fill: "solid" },
  { name: "newspaper", keyline: "horizontal", derivedFrom: undefined, Icon: PilotNewspaperIcon, Filled: PilotNewspaperFilledIcon, fill: "solid" },
  { name: "opacity", keyline: "square", derivedFrom: undefined, Icon: PilotOpacityIcon, Filled: PilotOpacityFilledIcon, fill: "weight" },
  { name: "open", keyline: "square", derivedFrom: undefined, Icon: PilotOpenIcon, Filled: PilotOpenFilledIcon, fill: "weight" },
  { name: "option", keyline: "horizontal", derivedFrom: undefined, Icon: PilotOptionIcon, Filled: PilotOptionFilledIcon, fill: "weight" },
  { name: "options", keyline: "square", derivedFrom: undefined, Icon: PilotOptionsIcon, Filled: PilotOptionsFilledIcon, fill: "solid" },
  { name: "outdent", keyline: "square", derivedFrom: undefined, Icon: PilotOutdentIcon, Filled: PilotOutdentFilledIcon, fill: "weight" },
  { name: "package", keyline: "square", derivedFrom: undefined, Icon: PilotPackageIcon, Filled: PilotPackageFilledIcon, fill: "solid" },
  { name: "padding", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingIcon, Filled: PilotPaddingFilledIcon, fill: "solid" },
  { name: "padding-axis", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingAxisIcon, Filled: PilotPaddingAxisFilledIcon, fill: "weight" },
  { name: "padding-ends", keyline: "square", derivedFrom: "padding-sides", Icon: PilotPaddingEndsIcon, Filled: PilotPaddingEndsFilledIcon, fill: "weight" },
  { name: "padding-side", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingSideIcon, Filled: PilotPaddingSideFilledIcon, fill: "weight" },
  { name: "padding-sides", keyline: "square", derivedFrom: undefined, Icon: PilotPaddingSidesIcon, Filled: PilotPaddingSidesFilledIcon, fill: "weight" },
  { name: "paint-bucket", keyline: "square", derivedFrom: undefined, Icon: PilotPaintBucketIcon, Filled: PilotPaintBucketFilledIcon, fill: "solid" },
  { name: "paintbrush", keyline: "vertical", derivedFrom: undefined, Icon: PilotPaintbrushIcon, Filled: PilotPaintbrushFilledIcon, fill: "solid" },
  { name: "palette", keyline: "circle", derivedFrom: undefined, Icon: PilotPaletteIcon, Filled: PilotPaletteFilledIcon, fill: "solid" },
  { name: "panel-bottom", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelBottomIcon, Filled: PilotPanelBottomFilledIcon, fill: "solid" },
  { name: "panel-left", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelLeftIcon, Filled: PilotPanelLeftFilledIcon, fill: "solid" },
  { name: "panel-left-close", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelLeftCloseIcon, Filled: PilotPanelLeftCloseFilledIcon, fill: "solid" },
  { name: "panel-left-open", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPanelLeftOpenIcon, Filled: PilotPanelLeftOpenFilledIcon, fill: "solid" },
  { name: "panel-right", keyline: "horizontal", derivedFrom: "panel-left", Icon: PilotPanelRightIcon, Filled: PilotPanelRightFilledIcon, fill: "solid" },
  { name: "panel-right-close", keyline: "horizontal", derivedFrom: "panel-left-close", Icon: PilotPanelRightCloseIcon, Filled: PilotPanelRightCloseFilledIcon, fill: "solid" },
  { name: "panel-right-open", keyline: "horizontal", derivedFrom: "panel-left-open", Icon: PilotPanelRightOpenIcon, Filled: PilotPanelRightOpenFilledIcon, fill: "solid" },
  { name: "panel-top", keyline: "horizontal", derivedFrom: "panel-bottom", Icon: PilotPanelTopIcon, Filled: PilotPanelTopFilledIcon, fill: "solid" },
  { name: "pause", keyline: "vertical", derivedFrom: undefined, Icon: PilotPauseIcon, Filled: PilotPauseFilledIcon, fill: "solid" },
  { name: "paw", keyline: "square", derivedFrom: undefined, Icon: PilotPawIcon, Filled: PilotPawFilledIcon, fill: "solid" },
  { name: "pen-tool", keyline: "vertical", derivedFrom: undefined, Icon: PilotPenToolIcon, Filled: PilotPenToolFilledIcon, fill: "solid" },
  { name: "pencil", keyline: "square", derivedFrom: undefined, Icon: PilotPencilIcon, Filled: PilotPencilFilledIcon, fill: "solid" },
  { name: "people", keyline: "circle", derivedFrom: undefined, Icon: PilotPeopleIcon, Filled: PilotPeopleFilledIcon, fill: "solid" },
  { name: "percent", keyline: "square", derivedFrom: undefined, Icon: PilotPercentIcon, Filled: PilotPercentFilledIcon, fill: "solid" },
  { name: "person", keyline: "vertical", derivedFrom: undefined, Icon: PilotPersonIcon, Filled: PilotPersonFilledIcon, fill: "solid" },
  { name: "person-add", keyline: "square", derivedFrom: undefined, Icon: PilotPersonAddIcon, Filled: PilotPersonAddFilledIcon, fill: "solid" },
  { name: "person-check", keyline: "square", derivedFrom: undefined, Icon: PilotPersonCheckIcon, Filled: PilotPersonCheckFilledIcon, fill: "solid" },
  { name: "person-circle", keyline: "circle", derivedFrom: undefined, Icon: PilotPersonCircleIcon, Filled: PilotPersonCircleFilledIcon, fill: "solid" },
  { name: "person-remove", keyline: "square", derivedFrom: undefined, Icon: PilotPersonRemoveIcon, Filled: PilotPersonRemoveFilledIcon, fill: "solid" },
  { name: "phone", keyline: "vertical", derivedFrom: undefined, Icon: PilotPhoneIcon, Filled: PilotPhoneFilledIcon, fill: "solid" },
  { name: "picture-in-picture", keyline: "horizontal", derivedFrom: undefined, Icon: PilotPictureInPictureIcon, Filled: PilotPictureInPictureFilledIcon, fill: "solid" },
  { name: "pie-chart", keyline: "circle", derivedFrom: undefined, Icon: PilotPieChartIcon, Filled: PilotPieChartFilledIcon, fill: "solid" },
  { name: "pin", keyline: "vertical", derivedFrom: undefined, Icon: PilotPinIcon, Filled: PilotPinFilledIcon, fill: "solid" },
  { name: "plane", keyline: "square", derivedFrom: undefined, Icon: PilotPlaneIcon, Filled: PilotPlaneFilledIcon, fill: "weight" },
  { name: "play", keyline: "circle", derivedFrom: undefined, Icon: PilotPlayIcon, Filled: PilotPlayFilledIcon, fill: "solid" },
  { name: "plug", keyline: "vertical", derivedFrom: undefined, Icon: PilotPlugIcon, Filled: PilotPlugFilledIcon, fill: "solid" },
  { name: "pointer", keyline: "square", derivedFrom: undefined, Icon: PilotPointerIcon, Filled: PilotPointerFilledIcon, fill: "solid" },
  { name: "polygon", keyline: "circle", derivedFrom: undefined, Icon: PilotPolygonIcon, Filled: PilotPolygonFilledIcon, fill: "solid" },
  { name: "power", keyline: "circle", derivedFrom: undefined, Icon: PilotPowerIcon, Filled: PilotPowerFilledIcon, fill: "weight" },
  { name: "printer", keyline: "square", derivedFrom: undefined, Icon: PilotPrinterIcon, Filled: PilotPrinterFilledIcon, fill: "solid" },
  { name: "prohibited", keyline: "circle", derivedFrom: undefined, Icon: PilotProhibitedIcon, Filled: PilotProhibitedFilledIcon, fill: "solid" },
  { name: "pushpin", keyline: "vertical", derivedFrom: undefined, Icon: PilotPushpinIcon, Filled: PilotPushpinFilledIcon, fill: "solid" },
  { name: "puzzle", keyline: "square", derivedFrom: undefined, Icon: PilotPuzzleIcon, Filled: PilotPuzzleFilledIcon, fill: "solid" },
  { name: "qr-code", keyline: "circle", derivedFrom: undefined, Icon: PilotQrCodeIcon, Filled: PilotQrCodeFilledIcon, fill: "solid" },
  { name: "quote", keyline: "horizontal", derivedFrom: undefined, Icon: PilotQuoteIcon, Filled: PilotQuoteFilledIcon, fill: "weight" },
  { name: "receipt", keyline: "square", derivedFrom: undefined, Icon: PilotReceiptIcon, Filled: PilotReceiptFilledIcon, fill: "solid" },
  { name: "record", keyline: "circle", derivedFrom: undefined, Icon: PilotRecordIcon, Filled: PilotRecordFilledIcon, fill: "solid" },
  { name: "rectangle", keyline: "horizontal", derivedFrom: undefined, Icon: PilotRectangleIcon, Filled: PilotRectangleFilledIcon, fill: "solid" },
  { name: "redo", keyline: "square", derivedFrom: "undo", Icon: PilotRedoIcon, Filled: PilotRedoFilledIcon, fill: "weight" },
  { name: "refresh", keyline: "circle", derivedFrom: "reset", Icon: PilotRefreshIcon, Filled: PilotRefreshFilledIcon, fill: "weight" },
  { name: "remove-circle", keyline: "circle", derivedFrom: undefined, Icon: PilotRemoveCircleIcon, Filled: PilotRemoveCircleFilledIcon, fill: "solid" },
  { name: "repeat", keyline: "square", derivedFrom: undefined, Icon: PilotRepeatIcon, Filled: PilotRepeatFilledIcon, fill: "weight" },
  { name: "reply", keyline: "square", derivedFrom: undefined, Icon: PilotReplyIcon, Filled: PilotReplyFilledIcon, fill: "weight" },
  { name: "reply-all", keyline: "square", derivedFrom: undefined, Icon: PilotReplyAllIcon, Filled: PilotReplyAllFilledIcon, fill: "weight" },
  { name: "reset", keyline: "circle", derivedFrom: undefined, Icon: PilotResetIcon, Filled: PilotResetFilledIcon, fill: "weight" },
  { name: "return", keyline: "square", derivedFrom: undefined, Icon: PilotReturnIcon, Filled: PilotReturnFilledIcon, fill: "weight" },
  { name: "rewind", keyline: "square", derivedFrom: "fast-forward", Icon: PilotRewindIcon, Filled: PilotRewindFilledIcon, fill: "solid" },
  { name: "rocket", keyline: "square", derivedFrom: undefined, Icon: PilotRocketIcon, Filled: PilotRocketFilledIcon, fill: "solid" },
  { name: "rotate", keyline: "square", derivedFrom: undefined, Icon: PilotRotateIcon, Filled: PilotRotateFilledIcon, fill: "solid" },
  { name: "rows", keyline: "square", derivedFrom: "columns", Icon: PilotRowsIcon, Filled: PilotRowsFilledIcon, fill: "solid" },
  { name: "ruler", keyline: "vertical", derivedFrom: undefined, Icon: PilotRulerIcon, Filled: PilotRulerFilledIcon, fill: "solid" },
  { name: "save", keyline: "square", derivedFrom: undefined, Icon: PilotSaveIcon, Filled: PilotSaveFilledIcon, fill: "solid" },
  { name: "scissors", keyline: "circle", derivedFrom: undefined, Icon: PilotScissorsIcon, Filled: PilotScissorsFilledIcon, fill: "weight" },
  { name: "screen-share", keyline: "square", derivedFrom: undefined, Icon: PilotScreenShareIcon, Filled: PilotScreenShareFilledIcon, fill: "solid" },
  { name: "search", keyline: "circle", derivedFrom: undefined, Icon: PilotSearchIcon, Filled: PilotSearchFilledIcon, fill: "weight" },
  { name: "send", keyline: "square", derivedFrom: undefined, Icon: PilotSendIcon, Filled: PilotSendFilledIcon, fill: "solid" },
  { name: "server", keyline: "circle", derivedFrom: undefined, Icon: PilotServerIcon, Filled: PilotServerFilledIcon, fill: "solid" },
  { name: "settings", keyline: "circle", derivedFrom: undefined, Icon: PilotSettingsIcon, Filled: PilotSettingsFilledIcon, fill: "solid" },
  { name: "shadow", keyline: "square", derivedFrom: undefined, Icon: PilotShadowIcon, Filled: PilotShadowFilledIcon, fill: "solid" },
  { name: "shapes", keyline: "square", derivedFrom: undefined, Icon: PilotShapesIcon, Filled: PilotShapesFilledIcon, fill: "solid" },
  { name: "share", keyline: "vertical", derivedFrom: undefined, Icon: PilotShareIcon, Filled: PilotShareFilledIcon, fill: "weight" },
  { name: "shield", keyline: "circle", derivedFrom: undefined, Icon: PilotShieldIcon, Filled: PilotShieldFilledIcon, fill: "solid" },
  { name: "shield-check", keyline: "circle", derivedFrom: undefined, Icon: PilotShieldCheckIcon, Filled: PilotShieldCheckFilledIcon, fill: "solid" },
  { name: "shift", keyline: "square", derivedFrom: undefined, Icon: PilotShiftIcon, Filled: PilotShiftFilledIcon, fill: "solid" },
  { name: "shopping-bag", keyline: "square", derivedFrom: undefined, Icon: PilotShoppingBagIcon, Filled: PilotShoppingBagFilledIcon, fill: "solid" },
  { name: "shuffle", keyline: "square", derivedFrom: undefined, Icon: PilotShuffleIcon, Filled: PilotShuffleFilledIcon, fill: "weight" },
  { name: "sides", keyline: "square", derivedFrom: undefined, Icon: PilotSidesIcon, Filled: PilotSidesFilledIcon, fill: "weight" },
  { name: "sigma", keyline: "vertical", derivedFrom: undefined, Icon: PilotSigmaIcon, Filled: PilotSigmaFilledIcon, fill: "weight" },
  { name: "skip-back", keyline: "square", derivedFrom: "skip-forward", Icon: PilotSkipBackIcon, Filled: PilotSkipBackFilledIcon, fill: "solid" },
  { name: "skip-forward", keyline: "square", derivedFrom: undefined, Icon: PilotSkipForwardIcon, Filled: PilotSkipForwardFilledIcon, fill: "solid" },
  { name: "sliders", keyline: "square", derivedFrom: "options", Icon: PilotSlidersIcon, Filled: PilotSlidersFilledIcon, fill: "solid" },
  { name: "smile", keyline: "circle", derivedFrom: undefined, Icon: PilotSmileIcon, Filled: PilotSmileFilledIcon, fill: "solid" },
  { name: "snowflake", keyline: "circle", derivedFrom: undefined, Icon: PilotSnowflakeIcon, Filled: PilotSnowflakeFilledIcon, fill: "weight" },
  { name: "sort", keyline: "square", derivedFrom: undefined, Icon: PilotSortIcon, Filled: PilotSortFilledIcon, fill: "weight" },
  { name: "sort-ascending", keyline: "square", derivedFrom: undefined, Icon: PilotSortAscendingIcon, Filled: PilotSortAscendingFilledIcon, fill: "weight" },
  { name: "sort-descending", keyline: "square", derivedFrom: "sort-ascending", Icon: PilotSortDescendingIcon, Filled: PilotSortDescendingFilledIcon, fill: "weight" },
  { name: "sparkle", keyline: "circle", derivedFrom: undefined, Icon: PilotSparkleIcon, Filled: PilotSparkleFilledIcon, fill: "solid" },
  { name: "speaker", keyline: "vertical", derivedFrom: undefined, Icon: PilotSpeakerIcon, Filled: PilotSpeakerFilledIcon, fill: "solid" },
  { name: "spline", keyline: "square", derivedFrom: undefined, Icon: PilotSplineIcon, Filled: PilotSplineFilledIcon, fill: "solid" },
  { name: "square-dashed", keyline: "square", derivedFrom: undefined, Icon: PilotSquareDashedIcon, Filled: PilotSquareDashedFilledIcon, fill: "weight" },
  { name: "star", keyline: "circle", derivedFrom: undefined, Icon: PilotStarIcon, Filled: PilotStarFilledIcon, fill: "solid" },
  { name: "star-off", keyline: "circle", derivedFrom: undefined, Icon: PilotStarOffIcon, Filled: PilotStarOffFilledIcon, fill: "solid" },
  { name: "status-available", keyline: "circle", derivedFrom: undefined, Icon: PilotStatusAvailableIcon, Filled: PilotStatusAvailableFilledIcon, fill: "solid" },
  { name: "sticky-note", keyline: "square", derivedFrom: undefined, Icon: PilotStickyNoteIcon, Filled: PilotStickyNoteFilledIcon, fill: "solid" },
  { name: "stop", keyline: "square", derivedFrom: undefined, Icon: PilotStopIcon, Filled: PilotStopFilledIcon, fill: "solid" },
  { name: "stop-circle", keyline: "circle", derivedFrom: undefined, Icon: PilotStopCircleIcon, Filled: PilotStopCircleFilledIcon, fill: "solid" },
  { name: "store", keyline: "square", derivedFrom: undefined, Icon: PilotStoreIcon, Filled: PilotStoreFilledIcon, fill: "solid" },
  { name: "strikethrough", keyline: "square", derivedFrom: undefined, Icon: PilotStrikethroughIcon, Filled: PilotStrikethroughFilledIcon, fill: "weight" },
  { name: "stroke-weight", keyline: "square", derivedFrom: undefined, Icon: PilotStrokeWeightIcon, Filled: PilotStrokeWeightFilledIcon, fill: "weight" },
  { name: "subscript", keyline: "square", derivedFrom: undefined, Icon: PilotSubscriptIcon, Filled: PilotSubscriptFilledIcon, fill: "weight" },
  { name: "subtract", keyline: "square", derivedFrom: undefined, Icon: PilotSubtractIcon, Filled: PilotSubtractFilledIcon, fill: "weight" },
  { name: "sun", keyline: "circle", derivedFrom: undefined, Icon: PilotSunIcon, Filled: PilotSunFilledIcon, fill: "solid" },
  { name: "superscript", keyline: "square", derivedFrom: undefined, Icon: PilotSuperscriptIcon, Filled: PilotSuperscriptFilledIcon, fill: "weight" },
  { name: "sync", keyline: "circle", derivedFrom: undefined, Icon: PilotSyncIcon, Filled: PilotSyncFilledIcon, fill: "weight" },
  { name: "table", keyline: "square", derivedFrom: undefined, Icon: PilotTableIcon, Filled: PilotTableFilledIcon, fill: "solid" },
  { name: "tablet", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTabletIcon, Filled: PilotTabletFilledIcon, fill: "solid" },
  { name: "tag", keyline: "circle", derivedFrom: undefined, Icon: PilotTagIcon, Filled: PilotTagFilledIcon, fill: "solid" },
  { name: "terminal", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTerminalIcon, Filled: PilotTerminalFilledIcon, fill: "solid" },
  { name: "text", keyline: "square", derivedFrom: undefined, Icon: PilotTextIcon, Filled: PilotTextFilledIcon, fill: "weight" },
  { name: "text-align-center", keyline: "square", derivedFrom: undefined, Icon: PilotTextAlignCenterIcon, Filled: PilotTextAlignCenterFilledIcon, fill: "weight" },
  { name: "text-align-left", keyline: "square", derivedFrom: undefined, Icon: PilotTextAlignLeftIcon, Filled: PilotTextAlignLeftFilledIcon, fill: "weight" },
  { name: "text-align-right", keyline: "square", derivedFrom: "text-align-left", Icon: PilotTextAlignRightIcon, Filled: PilotTextAlignRightFilledIcon, fill: "weight" },
  { name: "text-cursor", keyline: "vertical", derivedFrom: undefined, Icon: PilotTextCursorIcon, Filled: PilotTextCursorFilledIcon, fill: "weight" },
  { name: "text-size", keyline: "square", derivedFrom: undefined, Icon: PilotTextSizeIcon, Filled: PilotTextSizeFilledIcon, fill: "weight" },
  { name: "thermometer", keyline: "vertical", derivedFrom: undefined, Icon: PilotThermometerIcon, Filled: PilotThermometerFilledIcon, fill: "solid" },
  { name: "thumbs-down", keyline: "square", derivedFrom: "thumbs-up", Icon: PilotThumbsDownIcon, Filled: PilotThumbsDownFilledIcon, fill: "solid" },
  { name: "thumbs-up", keyline: "square", derivedFrom: undefined, Icon: PilotThumbsUpIcon, Filled: PilotThumbsUpFilledIcon, fill: "solid" },
  { name: "ticket", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTicketIcon, Filled: PilotTicketFilledIcon, fill: "solid" },
  { name: "timer", keyline: "circle", derivedFrom: undefined, Icon: PilotTimerIcon, Filled: PilotTimerFilledIcon, fill: "solid" },
  { name: "token", keyline: "circle", derivedFrom: undefined, Icon: PilotTokenIcon, Filled: PilotTokenFilledIcon, fill: "solid" },
  { name: "translate", keyline: "square", derivedFrom: undefined, Icon: PilotTranslateIcon, Filled: PilotTranslateFilledIcon, fill: "weight" },
  { name: "trash", keyline: "vertical", derivedFrom: undefined, Icon: PilotTrashIcon, Filled: PilotTrashFilledIcon, fill: "solid" },
  { name: "tree", keyline: "square", derivedFrom: undefined, Icon: PilotTreeIcon, Filled: PilotTreeFilledIcon, fill: "solid" },
  { name: "trending-down", keyline: "horizontal", derivedFrom: "trending-up", Icon: PilotTrendingDownIcon, Filled: PilotTrendingDownFilledIcon, fill: "weight" },
  { name: "trending-up", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTrendingUpIcon, Filled: PilotTrendingUpFilledIcon, fill: "weight" },
  { name: "trophy", keyline: "square", derivedFrom: undefined, Icon: PilotTrophyIcon, Filled: PilotTrophyFilledIcon, fill: "solid" },
  { name: "truck", keyline: "horizontal", derivedFrom: undefined, Icon: PilotTruckIcon, Filled: PilotTruckFilledIcon, fill: "solid" },
  { name: "tv", keyline: "square", derivedFrom: undefined, Icon: PilotTvIcon, Filled: PilotTvFilledIcon, fill: "solid" },
  { name: "umbrella", keyline: "square", derivedFrom: undefined, Icon: PilotUmbrellaIcon, Filled: PilotUmbrellaFilledIcon, fill: "solid" },
  { name: "underline", keyline: "vertical", derivedFrom: undefined, Icon: PilotUnderlineIcon, Filled: PilotUnderlineFilledIcon, fill: "weight" },
  { name: "undo", keyline: "square", derivedFrom: undefined, Icon: PilotUndoIcon, Filled: PilotUndoFilledIcon, fill: "weight" },
  { name: "unlock", keyline: "vertical", derivedFrom: undefined, Icon: PilotUnlockIcon, Filled: PilotUnlockFilledIcon, fill: "solid" },
  { name: "unpin", keyline: "circle", derivedFrom: undefined, Icon: PilotUnpinIcon, Filled: PilotUnpinFilledIcon, fill: "solid" },
  { name: "upload", keyline: "square", derivedFrom: undefined, Icon: PilotUploadIcon, Filled: PilotUploadFilledIcon, fill: "weight" },
  { name: "variable", keyline: "square", derivedFrom: undefined, Icon: PilotVariableIcon, Filled: PilotVariableFilledIcon, fill: "weight" },
  { name: "video", keyline: "horizontal", derivedFrom: undefined, Icon: PilotVideoIcon, Filled: PilotVideoFilledIcon, fill: "solid" },
  { name: "video-off", keyline: "square", derivedFrom: undefined, Icon: PilotVideoOffIcon, Filled: PilotVideoOffFilledIcon, fill: "solid" },
  { name: "volume", keyline: "square", derivedFrom: undefined, Icon: PilotVolumeIcon, Filled: PilotVolumeFilledIcon, fill: "solid" },
  { name: "volume-off", keyline: "square", derivedFrom: undefined, Icon: PilotVolumeOffIcon, Filled: PilotVolumeOffFilledIcon, fill: "solid" },
  { name: "wallet", keyline: "square", derivedFrom: undefined, Icon: PilotWalletIcon, Filled: PilotWalletFilledIcon, fill: "solid" },
  { name: "wand", keyline: "square", derivedFrom: undefined, Icon: PilotWandIcon, Filled: PilotWandFilledIcon, fill: "solid" },
  { name: "warning", keyline: "circle", derivedFrom: undefined, Icon: PilotWarningIcon, Filled: PilotWarningFilledIcon, fill: "solid" },
  { name: "watch", keyline: "vertical", derivedFrom: undefined, Icon: PilotWatchIcon, Filled: PilotWatchFilledIcon, fill: "solid" },
  { name: "waveform", keyline: "square", derivedFrom: undefined, Icon: PilotWaveformIcon, Filled: PilotWaveformFilledIcon, fill: "weight" },
  { name: "wifi", keyline: "horizontal", derivedFrom: undefined, Icon: PilotWifiIcon, Filled: PilotWifiFilledIcon, fill: "weight" },
  { name: "wifi-off", keyline: "circle", derivedFrom: undefined, Icon: PilotWifiOffIcon, Filled: PilotWifiOffFilledIcon, fill: "weight" },
  { name: "wind", keyline: "square", derivedFrom: undefined, Icon: PilotWindIcon, Filled: PilotWindFilledIcon, fill: "weight" },
  { name: "zoom-fit", keyline: "square", derivedFrom: undefined, Icon: PilotZoomFitIcon, Filled: PilotZoomFitFilledIcon, fill: "solid" },
  { name: "zoom-in", keyline: "circle", derivedFrom: undefined, Icon: PilotZoomInIcon, Filled: PilotZoomInFilledIcon, fill: "solid" },
  { name: "zoom-out", keyline: "circle", derivedFrom: undefined, Icon: PilotZoomOutIcon, Filled: PilotZoomOutFilledIcon, fill: "solid" },
] as const;
