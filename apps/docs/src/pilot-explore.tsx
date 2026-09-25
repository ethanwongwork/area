/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotF0PreviousIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M 6.757 2.649 A 1 1 0 0 1 7.693 2 L 10.523 2 A 1 1 0 0 1 11.451 3.371 L 10.411 5.971 A 0.75 0.75 0 0 0 11.108 7 L 10.899 7 A 1 1 0 0 1 11.675 8.631 L 8.03 13.117 A 1 1 0 0 1 6.259 12.586 L 6.068 10.675 A 0.75 0.75 0 0 0 5.321 10 L 5.443 10 A 1 1 0 0 1 4.507 8.649 Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF1FluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.983 3.021A0.75 0.75 0 0 1 6.697 2.5L10.035 2.5A0.75 0.75 0 0 1 10.771 3.397L10.27 5.902A0.5 0.5 0 0 0 10.76 6.5L11.094 6.5A0.75 0.75 0 0 1 11.657 7.745L6.636 13.466A0.75 0.75 0 0 1 5.334 12.837L5.743 10.589A0.5 0.5 0 0 0 5.251 10L4.777 10A0.75 0.75 0 0 1 4.063 9.021Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF3SlimIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.445 3.064A0.75 0.75 0 0 1 7.171 2.5L9.549 2.5A0.75 0.75 0 0 1 10.29 3.368L9.882 5.921A0.5 0.5 0 0 0 10.375 6.5L10.426 6.5A0.75 0.75 0 0 1 11.04 7.681L7.358 12.924A0.75 0.75 0 0 1 6.002 12.385L6.266 10.572A0.5 0.5 0 0 0 5.771 10L5.635 10A0.75 0.75 0 0 1 4.909 9.064Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotK0BookVIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 4.5C6.5 3.4 5 3 3 3A1.5 1.5 0 0 0 1.5 4.5V10A1.5 1.5 0 0 0 3 11.5C5 11.5 6.5 11.9 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5C9.5 3.4 11 3 13 3A1.5 1.5 0 0 1 14.5 4.5V10A1.5 1.5 0 0 1 13 11.5C11 11.5 9.5 11.9 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotL3FluentCardsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.5V3A1.5 1.5 0 0 1 3 1.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT0AIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 13.5L8 2.5L13 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.818 9.5H11.182" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT1TTicksIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 4.5V2.5H13V4.5M8 2.5V13.5M6 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT2TPlainIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 2.5H13M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT3TBoxIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 5.5H11M8 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "Flash", label: "Previous: flat top, filleted", Icon: PilotF0PreviousIcon, gaps: [], counters: [4.89], notes: [] },
  { group: "Flash", label: "Previous: Fluent proportions, full width", Icon: PilotF1FluentIcon, gaps: [], counters: [5.06], notes: [] },
  { group: "Flash", label: "Applied: Fluent structure at 80% width", Icon: PilotF3SlimIcon, gaps: [], counters: [4.06], notes: [] },
  { group: "Book", label: "Previous: pages dip to the spine (V)", Icon: PilotK0BookVIcon, gaps: [], counters: [5.43,5.43], notes: [] },
  { group: "Layers", label: "Fluent-style diagonal cards (three sheets)", Icon: PilotL3FluentCardsIcon, gaps: ["1.38 tight","3.88 open","1.38 tight"], counters: [5.93], notes: [] },
  { group: "Text", label: "Previous: letter A (49° apex)", Icon: PilotT0AIcon, gaps: [], counters: [3.02], notes: ["corner at 8,2.5 is 48.89°; below 60° round it with an arc (r ≥ 1) or open the angle"] },
  { group: "Text", label: "Applied: T with ticks and a foot", Icon: PilotT1TTicksIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "Plain T", Icon: PilotT2TPlainIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "T in a text box", Icon: PilotT3TBoxIcon, gaps: ["1.88 standard"], counters: [5.43], notes: ["ink 14.13×12.13 exceeds the square keyline 13×13"] },
];
