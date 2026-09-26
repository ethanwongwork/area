/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotF4SharpFluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 1.5L10.5 1.5L9.25 6L12.5 6L5 14.5L6.5 9L3.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF5ClassicIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 1.5L11 1.5L8.5 6.5L12.5 6.5L5.5 14.5L7 9L3.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH0SlashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3L13 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH1ClosedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 6.5C3.5 10.5 12.5 10.5 14.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9.5V12M4.5 8.912L3 10.662M11.5 8.912L13 10.662" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH2SlashCutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C9 3.5 9.9 3.7 10.8 4.1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.9 5.6C13.5 6.3 14 7.1 14.5 8C12.75 11.25 10.5 12.5 8 12.5C7 12.5 6.1 12.3 5.2 11.9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.1 10.4C2.5 9.7 2 8.9 1.5 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3L13 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
  { group: "Flash", label: "Sharp: Fluent structure", Icon: PilotF4SharpFluentIcon, gaps: [], counters: [4], notes: [] },
  { group: "Flash", label: "Applied: sharp classic bolt", Icon: PilotF5ClassicIcon, gaps: [], counters: [3.24], notes: [] },
  { group: "Hide", label: "Previous: eye with a slash", Icon: PilotH0SlashIcon, gaps: [], counters: [4.11,4.11], notes: [] },
  { group: "Hide", label: "Applied: closed eye (Figma, Notion)", Icon: PilotH1ClosedIcon, gaps: [], counters: [], notes: [] },
  { group: "Hide", label: "Eye with a slash, lids cut (Lucide)", Icon: PilotH2SlashCutIcon, gaps: ["1.46 tight","1.46 tight","3.47 open"], counters: [], notes: [] },
  { group: "Book", label: "Previous: pages dip to the spine (V)", Icon: PilotK0BookVIcon, gaps: [], counters: [5.43,5.43], notes: [] },
  { group: "Layers", label: "Fluent-style diagonal cards (three sheets)", Icon: PilotL3FluentCardsIcon, gaps: ["1.38 tight","3.88 open","1.38 tight"], counters: [5.93], notes: [] },
  { group: "Text", label: "Previous: letter A (49° apex)", Icon: PilotT0AIcon, gaps: [], counters: [3.02], notes: ["corner at 8,2.5 is 48.89°; below 60° round it with an arc (r ≥ 1) or open the angle"] },
  { group: "Text", label: "Applied: T with ticks and a foot", Icon: PilotT1TTicksIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "Plain T", Icon: PilotT2TPlainIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "T in a text box", Icon: PilotT3TBoxIcon, gaps: ["1.88 standard"], counters: [5.43], notes: ["ink 14.13×12.13 exceeds the square keyline 13×13"] },
];
