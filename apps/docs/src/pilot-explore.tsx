/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import type { PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotF1CurrentIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M1.5 11.5V4.5A1 1 0 0 1 2.5 3.5H6.5L8 5H13.5A1 1 0 0 1 14.5 6V11.5A1 1 0 0 1 13.5 12.5H2.5A1 1 0 0 1 1.5 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.5H6.5L8 5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF2NarrowIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 11.5V4.5A1 1 0 0 1 3.5 3.5H6.5L8 5H12.5A1 1 0 0 1 13.5 6V11.5A1 1 0 0 1 12.5 12.5H3.5A1 1 0 0 1 2.5 11.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6.5H6.5L8 5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF3TallerIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M2 12V4A1 1 0 0 1 3 3H6L7.5 4.5H13A1 1 0 0 1 14 5.5V12A1 1 0 0 1 13 13H3A1 1 0 0 1 2 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6H6L7.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF4SquarerIcon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 12V4A1 1 0 0 1 3.5 3H6L7.5 4.5H12.5A1 1 0 0 1 13.5 5.5V12A1 1 0 0 1 12.5 13H3.5A1 1 0 0 1 2.5 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6H6L7.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: weight ?? "var(--area-weight-icon)" }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "Folder", label: "Previous (13 × 9, 1.44:1)", Icon: PilotF1CurrentIcon, gaps: [], counters: [1.93,6.43], notes: [] },
  { group: "Folder", label: "Applied: narrower (11 × 9, 1.22:1)", Icon: PilotF2NarrowIcon, gaps: [], counters: [1.93,6.43], notes: [] },
  { group: "Folder", label: "Taller (12 × 10, 1.20:1)", Icon: PilotF3TallerIcon, gaps: [], counters: [1.93,7.43], notes: [] },
  { group: "Folder", label: "Squarer (11 × 10, 1.10:1)", Icon: PilotF4SquarerIcon, gaps: [], counters: [1.93,7.43], notes: [] },
];
