/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotB0CurrentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 10.5V6.5A4.5 4.5 0 0 1 12.5 6.5V10.5L13.5 11.5H2.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotB1SoftIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8.5C12.5 9.75 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.75 3.5 8.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotB2LongIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8C12.5 9.5 13.5 10.25 13.5 11A0.5 0.5 0 0 1 13 11.5H3A0.5 0.5 0 0 1 2.5 11C2.5 10.25 3.5 9.5 3.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotB3FluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.5 6.5A4.5 4.5 0 0 1 12.5 6.5V8.5Q12.5 8.75 12.6 9L13.45 11.1A0.3 0.3 0 0 1 13.2 11.5H2.8A0.3 0.3 0 0 1 2.55 11.1L3.4 9Q3.5 8.75 3.5 8.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V12A2 2 0 0 0 10 12V11.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "Bell flare", label: "Previous: 1px 45° step", Icon: PilotB0CurrentIcon, gaps: [], counters: [7.93,1.43], notes: [] },
  { group: "Bell flare", label: "Soft S-curve flare, rounded base ends", Icon: PilotB1SoftIcon, gaps: [], counters: [7.93,1.43], notes: [] },
  { group: "Bell flare", label: "Applied: longer flare from higher up", Icon: PilotB2LongIcon, gaps: [], counters: [7.93,1.43], notes: [] },
  { group: "Bell flare", label: "Fluent-like straight steep flare, rounded ends", Icon: PilotB3FluentIcon, gaps: [], counters: [7.93,1.43], notes: ["segment 12.6,9 → 13.45,11.1 is not at 0°, 45° or 90°","diagonal 12.6,9 → 13.45,11.1 is off the diagonal pixel lattice (x − y must be whole)","segment 2.55,11.1 → 3.4,9 is not at 0°, 45° or 90°","diagonal 2.55,11.1 → 3.4,9 is off the diagonal pixel lattice (x + y must be whole)"] },
];
