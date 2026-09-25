/**
 * Area icon pilot, generated from apps/docs/assets/area-icons-pilot by
 * scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each icon is a stroked 16px drawing. The line weight follows --area-weight-icon (1.125px for
 * Geist); pass `weight` in CSS pixels to override it, as the gallery comparison does.
 */
import type { SVGProps } from "react";

export type PilotIconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { weight?: number };
const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

export const PilotAddIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M8 3V13M3 8H13" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotAlignLeftIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="4" width="8" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="9" width="5" height="3" rx="1" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotBellIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M4 10.5V6A4 4 0 0 1 12 6V10.5M2.5 10.5H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 12.5A1.5 1.5 0 0 0 9.5 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotCheckIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 8L6.5 11L12.5 5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotChevronDownIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M4 6L8 10L12 6" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotDismissIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M4 4L12 12M12 4L4 12" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotEyeIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M1.75 8C3.5 4.75 6 3.75 8 3.75C10 3.75 12.5 4.75 14.25 8C12.5 11.25 10 12.25 8 12.25C6 12.25 3.5 11.25 1.75 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.75" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotInfoIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.375" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.25V11.25" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="5" r="0.875" fill="currentColor" />
  </svg>
);

export const PilotMoreHorizontalIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const PilotSearchIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.25 10.25L13.25 13.25" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotSettingsIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M6.691 3.434L6.915 1.845L9.085 1.845L9.309 3.434L11.300 4.583L12.788 3.983L13.873 5.862L12.609 6.851L12.609 9.149L13.873 10.138L12.788 12.017L11.300 11.417L9.309 12.566L9.085 14.155L6.915 14.155L6.691 12.566L4.700 11.417L3.212 12.017L2.127 10.138L3.391 9.149L3.391 6.851L2.127 5.862L3.212 3.983L4.700 4.583Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.75" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PilotStatusAvailableIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.375" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.25 8.25L7.25 10.25L10.75 6.75" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PILOT_ICONS = [
  { name: "add", Icon: PilotAddIcon },
  { name: "align-left", Icon: PilotAlignLeftIcon },
  { name: "bell", Icon: PilotBellIcon },
  { name: "check", Icon: PilotCheckIcon },
  { name: "chevron-down", Icon: PilotChevronDownIcon },
  { name: "dismiss", Icon: PilotDismissIcon },
  { name: "eye", Icon: PilotEyeIcon },
  { name: "info", Icon: PilotInfoIcon },
  { name: "more-horizontal", Icon: PilotMoreHorizontalIcon },
  { name: "search", Icon: PilotSearchIcon },
  { name: "settings", Icon: PilotSettingsIcon },
  { name: "status-available", Icon: PilotStatusAvailableIcon },
] as const;
