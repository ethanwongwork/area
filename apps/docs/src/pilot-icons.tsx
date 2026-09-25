/**
 * Area icon pilot, generated from apps/docs/assets/area-icons-pilot by
 * scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each icon is a stroked 16px drawing. The line weight follows --area-weight-icon (1.125px for
 * Geist); pass `weight` in CSS pixels to override it, as the gallery comparison does.
 * Filled variants are derived from each shape's data-filled role; cut-outs use a mask.
 */
import { useId, type SVGProps } from "react";

export type PilotIconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { weight?: number };
const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;
const useMaskId = () => "area-icon-" + useId().replace(/[^A-Za-z0-9-]/g, "");

export const PilotAddIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M8 2.5V13.5M2.5 8H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignLeftIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignLeftFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...props}>
      <rect x="5.5" y="3.5" width="8" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="5" height="3" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotArrowUpIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M8 13V3M3.5 7.5L8 3L12.5 7.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBellIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 10.5V6.5A4.5 4.5 0 0 1 12.5 6.5V10.5L13.5 11.5H2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBellFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 10.5V6.5A4.5 4.5 0 0 1 12.5 6.5V10.5L13.5 11.5H2.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotCheckIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3 8L6.5 11.5L13.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChevronDownIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCopyIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.5V3.5A1 1 0 0 1 3.5 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCopyFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  return (
    <svg {...base} {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 8.5V3.5A1 1 0 0 1 3.5 2.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotDismissIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3 3L13 13M13 3L3 13" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M4.5 1.5H8.5L12.5 5.5V13.5A1 1 0 0 1 11.5 14.5H4.5A1 1 0 0 1 3.5 13.5V2.5A1 1 0 0 1 4.5 1.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 1.5V4.5A1 1 0 0 0 9.5 5.5H12.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 8.5H9.5M6.5 11.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDocumentFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8.5 1.5V4.5A1 1 0 0 0 9.5 5.5H12.5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 8.5H9.5M6.5 11.5H9.5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M4.5 1.5H8.5L12.5 5.5V13.5A1 1 0 0 1 11.5 14.5H4.5A1 1 0 0 1 3.5 13.5V2.5A1 1 0 0 1 4.5 1.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotEyeIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyeFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotFolderIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M1.5 11.5V4.5A1 1 0 0 1 2.5 3.5H6.5L8 5H13.5A1 1 0 0 1 14.5 6V11.5A1 1 0 0 1 13.5 12.5H2.5A1 1 0 0 1 1.5 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.5H6.5L8 5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotFolderFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M1.5 6.5H6.5L8 5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M1.5 11.5V4.5A1 1 0 0 1 2.5 3.5H6.5L8 5H13.5A1 1 0 0 1 14.5 6V11.5A1 1 0 0 1 13.5 12.5H2.5A1 1 0 0 1 1.5 11.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotInfoIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.25V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="4.375" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotInfoFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 7.25V11.5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="4.375" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotMoreHorizontalIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const PilotSearchIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSettingsIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M6.75 4.103L7 2.5L9 2.5L9.25 4.103L10.75 4.969L12.263 4.384L13.263 6.116L12 7.134L12 8.866L13.263 9.884L12.263 11.616L10.75 11.031L9.25 11.897L9 13.5L7 13.5L6.75 11.897L5.25 11.031L3.737 11.616L2.737 9.884L4 8.866L4 7.134L2.737 6.116L3.737 4.384L5.25 4.969Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSettingsFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <circle cx="8" cy="8" r="1.5" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.75 4.103L7 2.5L9 2.5L9.25 4.103L10.75 4.969L12.263 4.384L13.263 6.116L12 7.134L12 8.866L13.263 9.884L12.263 11.616L10.75 11.031L9.25 11.897L9 13.5L7 13.5L6.75 11.897L5.25 11.031L3.737 11.616L2.737 9.884L4 8.866L4 7.134L2.737 6.116L3.737 4.384L5.25 4.969Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotStatusAvailableIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8L7 10L11 6" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStatusAvailableFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M5 8L7 10L11 6" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PilotTrashIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3 4.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 4.5V2.5A1 1 0 0 1 7.5 1.5H8.5A1 1 0 0 1 9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.5V13.5A1 1 0 0 0 4.5 14.5H11.5A1 1 0 0 0 12.5 13.5V4.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 7.5V11.5M9.5 7.5V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotTrashFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M6.5 7.5V11.5M9.5 7.5V11.5" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M3.5 4.5V13.5A1 1 0 0 0 4.5 14.5H11.5A1 1 0 0 0 12.5 13.5V4.5Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M3 4.5H13" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 4.5V2.5A1 1 0 0 1 7.5 1.5H8.5A1 1 0 0 1 9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PilotWarningIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M6.891 3.133A1.25 1.25 0 0 1 9.109 3.133L13.55 11.673A1.25 1.25 0 0 1 12.441 13.5L3.559 13.5A1.25 1.25 0 0 1 2.45 11.673Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6.25V8" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10.75" r="0.75" fill="currentColor" />
  </svg>
);

export const PilotWarningFilledIcon = ({ weight, ...props }: PilotIconProps) => {
  const id = useMaskId();
  return (
    <svg {...base} {...props}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        <path d="M8 6.25V8" fill="none" stroke="black" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="10.75" r="0.75" fill="black" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d="M6.891 3.133A1.25 1.25 0 0 1 9.109 3.133L13.55 11.673A1.25 1.25 0 0 1 12.441 13.5L3.559 13.5A1.25 1.25 0 0 1 2.45 11.673Z" fill="currentColor" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const PILOT_ICONS = [
  { name: "add", keyline: "square", Icon: PilotAddIcon, Filled: undefined },
  { name: "align-left", keyline: "square", Icon: PilotAlignLeftIcon, Filled: PilotAlignLeftFilledIcon },
  { name: "arrow-up", keyline: "vertical", Icon: PilotArrowUpIcon, Filled: undefined },
  { name: "bell", keyline: "square", Icon: PilotBellIcon, Filled: PilotBellFilledIcon },
  { name: "check", keyline: "horizontal", Icon: PilotCheckIcon, Filled: undefined },
  { name: "chevron-down", keyline: "horizontal", Icon: PilotChevronDownIcon, Filled: undefined },
  { name: "copy", keyline: "square", Icon: PilotCopyIcon, Filled: PilotCopyFilledIcon },
  { name: "dismiss", keyline: "circle", Icon: PilotDismissIcon, Filled: undefined },
  { name: "document", keyline: "vertical", Icon: PilotDocumentIcon, Filled: PilotDocumentFilledIcon },
  { name: "eye", keyline: "horizontal", Icon: PilotEyeIcon, Filled: PilotEyeFilledIcon },
  { name: "folder", keyline: "horizontal", Icon: PilotFolderIcon, Filled: PilotFolderFilledIcon },
  { name: "info", keyline: "circle", Icon: PilotInfoIcon, Filled: PilotInfoFilledIcon },
  { name: "more-horizontal", keyline: "horizontal", Icon: PilotMoreHorizontalIcon, Filled: undefined },
  { name: "search", keyline: "circle", Icon: PilotSearchIcon, Filled: undefined },
  { name: "settings", keyline: "circle", Icon: PilotSettingsIcon, Filled: PilotSettingsFilledIcon },
  { name: "status-available", keyline: "circle", Icon: PilotStatusAvailableIcon, Filled: PilotStatusAvailableFilledIcon },
  { name: "trash", keyline: "vertical", Icon: PilotTrashIcon, Filled: PilotTrashFilledIcon },
  { name: "warning", keyline: "circle", Icon: PilotWarningIcon, Filled: PilotWarningFilledIcon },
] as const;
